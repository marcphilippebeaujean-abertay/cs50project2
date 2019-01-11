
module.exports = function(api) {
    api.cache(true);
    const presets = [["@babel/preset-env", {
      targets: {
        browsers: [
          "last 5 versions",
          "ie > 8"
        ]
      }
    }]];
    const plugins = []
    return {
        presets,
        plugins
    };
};