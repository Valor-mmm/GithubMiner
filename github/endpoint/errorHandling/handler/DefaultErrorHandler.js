class DefaultErrorHandler {

    static handleError(err, options) {
        DefaultErrorHandler._options = options; // Ignore warning: unused
        const message = `Error could not be handled properly! Aborting! Error: "${err}"`;
        logger.error(message);
        throw new Error(message);
    }

}

exports.DefaultErrorHandler = DefaultErrorHandler;

const logger = require('../../../../LoggerProvider').getLogger(DefaultErrorHandler);
