const logplease = require('logplease');
const LoggerProviderLogger = logplease.create('LoggerProvider');

const loggers = {
    queryCaller: logplease.create('QueryCaller'),
    queryExecutor: logplease.create('QueryExecutor'),
    errorLogger: logplease.create('ErrorLogger'),
    defaultLogger: logplease.create('DefaultLogger')
};

const getLogger = function getLogger(targetClass) {
    if (!targetClass) {
        LoggerProviderLogger.warn('TargetClass for logger determination is missing: ' + targetClass);
        return loggers.defaultLogger;
    }

    if (targetClass.name) {
        if (!loggers[targetClass.name]) {
            loggers[targetClass.name] = logplease.create(targetClass.name);
        }
        return loggers[targetClass.name];
    }

    return loggers.defaultLogger;
};

exports.getLogger = getLogger;

