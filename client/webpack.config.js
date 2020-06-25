const createExpoWebpackConfig = require('@expo/webpack-config');
module.exports = function (env, argv) {
    env.mode = process.env.NODE_ENV;
    const config = createExpoWebpackConfig(env, argv);
    return config;
};
