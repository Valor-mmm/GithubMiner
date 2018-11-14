class ErrorHandler {

    static handleError(err, options) {
        const errMsg = 'Not implemented! This function has to be overwritten by all subclasses!';
        logger.error(errMsg, err);
        throw new Error(errMsg);
    }

}

exports.ErrorHandler = ErrorHandler;

const logger = require('../../../../LoggerProvider').getLogger(ErrorHandler);