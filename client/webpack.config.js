const createExpoWebpackConfig = require('@expo/webpack-config');
module.exports = function (env, argv) {
    env.mode = 'production';
    const config = createExpoWebpackConfig(env, argv);
    return config;
};
