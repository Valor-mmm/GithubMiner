const ErrorHandler = require('./ErrorHandler').ErrorHandler;
const ResolveAction = require('../ResolveAction');

class DefaultErrorHandler extends ErrorHandler {

    static handleError(err, options) {
        DefaultErrorHandler._options = options; // Ignore warning: unused
        const message = `Error could not be handled properly! Aborting! Error: "${err}"`;
        logger.error(message);
        return {
            shouldRepeat: false,
            preventRepeat: true,
            resolveActions: [ResolveAction.PERSIST_ERROR, ResolveAction.ABORT]
        };
    }

}

exports.DefaultErrorHandler = DefaultErrorHandler;

const logger = require('../../../../LoggerProvider').getLogger(DefaultErrorHandler);
