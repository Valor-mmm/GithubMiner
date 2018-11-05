class ConfigMerger {

    static mergeConfig(overrideConfig, defaultConfig) {
        let givenConfig = {};
        let defaultConf= {};
        if (overrideConfig && typeof overrideConfig  === 'object') {
            Object.assign(givenConfig, overrideConfig);
        }

        Object.assign(defaultConf, defaultConfig);
        Object.assign(defaultConf, givenConfig);

        return defaultConf;
    }

}

module.exports = ConfigMerger;