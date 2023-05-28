// https://gist.github.com/giautm/402e1732c89548281d6605ef77289476
const { withDangerousMod, withPlugins } = require('@expo/config-plugins');
const {
    mergeContents,
} = require('@expo/config-plugins/build/utils/generateCode');
const fs = require('fs');
const path = require('path');

async function readFileAsync(path) {
    return fs.promises.readFile(path, 'utf8');
}

async function saveFileAsync(path, content) {
    return fs.promises.writeFile(path, content, 'utf8');
}

const withDisableAdIDSupport = c => {
    return withDangerousMod(c, [
        'ios',
        async config => {
            const file = path.join(
                config.modRequest.platformProjectRoot,
                'Podfile'
            );
            const contents = await readFileAsync(file);
            await saveFileAsync(file, disableAdIDSupport(contents));
            return config;
        },
    ]);
};

function disableAdIDSupport(src) {
    return mergeContents({
        tag: `rn-firebase-disable-ad-id-support`,
        src,
        newSrc: '$RNFirebaseAnalyticsWithoutAdIdSupport = true',
        anchor: /platform :ios/,
        offset: 0,
        comment: '#',
    }).contents;
}

module.exports = config => withPlugins(config, [withDisableAdIDSupport]);
