const NotFoundErrorHandler = require('./handler/NotFoundErrorHandler');
const TimeoutErrorHandler = require('./handler/TimeoutErrorHandler');
const DefaultErrorHandler = require('./handler/DefaultErrorHandler');

const timeoutErrorPattern = /timeout/;

class ErrorHandler {

    static handleErrors(resultWriter, error) {
        if (!error || !error.response || !Array.isArray(error.response.errors)) {
            console.error('Error object has not the expected form. Can not handle error: ' + error);
            return null;
        }

        let options = {errorObject:error, resultWriter: resultWriter};
        const repeatInfo = [];

        for(const err of error.response.errors) {
            const errorHandler = this.getErrorHandler(err);
            if (typeof errorHandler.handleError !== 'function') {
                console.error('Error handler is not valid in this context.' + errorHandler);
                return null;
            }

            try {
                repeatInfo.push(errorHandler.handleError(err, options));
            } catch (e) {
                resultWriter.commit();
            }
        }

        const shouldRepeat = ErrorHandler.determineShouldRepeat(repeatInfo);
        console.log('Error handler advices to repeat: ' + shouldRepeat);
        return shouldRepeat;
    }

    static determineShouldRepeat(repeatInfo) {
        if (!Array.isArray(repeatInfo)) {
            console.error('Can not determine if call should be repeated. RepeatInfo is malformed: ' + repeatInfo);
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
            console.log('Error: TimeoutError');
            return TimeoutErrorHandler;
        }

        if (!error || !error.type) {
            console.error('Given error is an unexpected format: ' + error);
            return null;
        }

        switch (error.type) {
            case 'NOT_FOUND':
                console.log('Error: NotFoundError');
                return NotFoundErrorHandler;
            default:
                console.log('Error: DefaultError');
                return DefaultErrorHandler;

        }
    }

}

module.exports = ErrorHandler;