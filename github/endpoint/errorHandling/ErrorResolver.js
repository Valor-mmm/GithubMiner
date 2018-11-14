const NotFoundErrorHandler = require('./handler/NotFoundErrorHandler');
const TimeoutErrorHandler = require('./handler/TimeoutErrorHandler');
const DefaultErrorHandler = require('./handler/DefaultErrorHandler');

const timeoutErrorPattern = /timeout/;

class ErrorResolver {

    static handleErrors(resultWriter, error) {
        if (!error || !error.response || !Array.isArray(error.response.errors)) {
            logger.error('Error object has not the expected form. Can not handle error: ' + error);
            return null;
        }

        let options = {errorObject:error, resultWriter: resultWriter};
        const repeatInfo = [];

        for(const err of error.response.errors) {
            const errorHandler = this.getErrorHandler(err);
            if (typeof errorHandler.handleError !== 'function') {
                logger.error('Error handler is not valid in this context.' + errorHandler);
                return null;
            }

            try {
                repeatInfo.push(errorHandler.handleError(err, options));
            } catch (e) {
                resultWriter.commit();
            }
        }

        const shouldRepeat = ErrorResolver.determineShouldRepeat(repeatInfo);
        logger.log('Error handler advices to repeat: ' + shouldRepeat);
        return shouldRepeat;
    }

    static determineShouldRepeat(repeatInfo) {
        if (!Array.isArray(repeatInfo)) {
            logger.error('Can not determine if call should be repeated. RepeatInfo is malformed: ' + repeatInfo);
            return false;
        }

        const preventRepeat = repeatInfo.some(elem => elem.preventRepeat);
        const shouldRepeat = repeatInfo.some(elem => elem.shouldRepeat);

        if (preventRepeat) {
            return false;
        }
        return shouldRepeat;
    }

    static getErrorHandler(error) {
        if (error && error.message && timeoutErrorPattern.test(error.message)) {
            logger.log('Error: TimeoutError');
            return TimeoutErrorHandler;
        }

        if (!error || !error.type) {
            logger.error('Given error is an unexpected format: ' + error);
            return null;
        }

        switch (error.type) {
            case 'NOT_FOUND':
                logger.log('Error: NotFoundError');
                return NotFoundErrorHandler;
            default:
                logger.log('Error: DefaultError');
                return DefaultErrorHandler;

        }
    }

}

exports.ErrorResolver = ErrorResolver;

const logger = require('../../../LoggerProvider').getLogger(ErrorResolver);
