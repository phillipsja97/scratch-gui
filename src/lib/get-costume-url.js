import storage from './storage';
import {inlineSvgFonts} from 'scratch-svg-renderer';

// Contains 'font-family', but doesn't only contain 'font-family="none"'
const HAS_FONT_REGEXP = 'font-family(?!="none")';

const getCostumeUrl = (function () {
    let cachedAssetId;
    let cachedUrl;

    return function (asset) {
        // eslint-disable-next-line no-console
        console.log(cachedAssetId);
        if (cachedAssetId === asset.assetId) {
            return cachedUrl;
        }

        cachedAssetId = asset.assetId;

        // If the SVG refers to fonts, they must be inlined in order to display correctly in the img tag.
        // Avoid parsing the SVG when possible, since it's expensive.
        if (asset.assetType === storage.AssetType.ImageVector) {
            const svgString = asset.decodeText();
            if (svgString.match(HAS_FONT_REGEXP)) {
                const svgText = inlineSvgFonts(svgString);
                cachedUrl = `data:image/svg+xml;utf8,${encodeURIComponent(svgText)}`;
                // eslint-disable-next-line no-console
                console.log(cachedUrl);
            } else {
                cachedUrl = asset.encodeDataURI();
            }
        } else {
            cachedUrl = asset.encodeDataURI();
        }

        return cachedUrl;
    };
}());

export {
    getCostumeUrl as default,
    HAS_FONT_REGEXP
};
