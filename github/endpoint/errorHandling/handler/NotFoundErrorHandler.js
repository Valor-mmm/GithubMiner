const ResultWriter = require('../../../../ResultWriter').ResultWriter;
const ErrorHandler = require('./ErrorHandler').ErrorHandler;

const messageExtractPattern = /^Could not resolve to a (\w+?) with the \w+? '(.*?)'\.$/;

class NotFoundErrorHandler extends ErrorHandler {

    static handleError(error, options) {
        if (!error || !error.type || error.type !== 'NOT_FOUND') {
            const errMsg = `Can not handle given error "${error}"`;
            logger.error(errMsg);
            throw new Error(errMsg);
        }

        if (!options || !options.errorObject || !(options.resultWriter instanceof ResultWriter)) {
            const errMsg = `Can not handle error without proper options parameter: "${options}"`;
            logger.error(errMsg);
            throw new Error(errMsg);
        }

        if (!options.errorObject.response || !options.errorObject.response.data) {
            const errMsg = `Given error does not contain data in the response!.`;
            logger.error(errMsg);
            throw new Error(errMsg);
        }

        const target = NotFoundErrorHandler.determineTarget(error);
        options.resultWriter.appendNotFoundList([target]);
        options.resultWriter.appendResult(options.errorObject.response.data);

        return {preventRepeat: false, shouldRepeat: false};
    }

    static determineTarget(error) {
        if (!error || !error.message || !Array.isArray(error.path)) {
            const errMsg = `Error object is missing crucial properties for error handling. "${error}"`;
            logger.error(errMsg);
            throw new Error(errMsg);
        }

        const match = messageExtractPattern.exec(error.message);

        if (!Array.isArray(match) || match.length !== 3) {
            const errMsg = `Message does not match expected pattern: "${error.message}"`;
            logger.error(errMsg);
            throw new Error(errMsg);
        }

        return {
            path: error.path,
            target: match[1],
            name: match[2]
        }
    }

}

exports.NotFoundErrorHandler = NotFoundErrorHandler;

const logger = require('../../../../LoggerProvider').getLogger(NotFoundErrorHandler);