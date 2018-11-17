const NotFoundErrorHandler = require('./handler/NotFoundErrorHandler').NotFoundErrorHandler;
const TimeoutErrorHandler = require('./handler/TimeoutErrorHandler');
const DefaultErrorHandler = require('./handler/DefaultErrorHandler').DefaultErrorHandler;
const ErrorHandler = require('./handler/ErrorHandler').ErrorHandler;
const ResolveAction = require('./ResolveAction');

const timeoutErrorPattern = /timeout/;

class ErrorResolver {

    static handleErrors(resultWriter, error) {
        let options = {errorObject:error, resultWriter: resultWriter};
        const resolveInfo = [];
        const errors = ErrorResolver.extractErrorsFromErrorObject(error);

        if (!Array.isArray(errors)) {
            logger.error('Could not read errors of given error object. Can not handle error.', + error);
            return [ResolveAction.PERSIST_ERROR, ResolveAction.ABORT];
        }

        for(const err of errors) {
            const errorHandler = this.getErrorHandler(err);
            if (errorHandler instanceof ErrorHandler) {
                logger.error('The given error handler is not valid! ' + errorHandler);
                return null;
            }

            try {
                resolveInfo.push(errorHandler.handleError(err, options));
            } catch (e) {
                resultWriter.commit();
            }
        }

        return this.determineResolveActions(resolveInfo);
    }

    static determineResolveActions(resolveInfo) {
        if (!Array.isArray(resolveInfo)) {
            logger.error('Can not determine ResolveAction because resolveInfo is malformed.' , resolveInfo);
            return null;
        }

        const shouldRepeat = ErrorResolver.determineShouldRepeat(resolveInfo);
        const resolveActions = resolveInfo.map((elem) => elem.resolveActions)
            .reduce((accum, elem) => {
                if (!Array.isArray(elem)) {
                    logger.warn(`Had to convert ${elem} to array. ErrorHandler should return array of ResolveActions.`);
                    elem = [elem];
                }
                return accum.concat(elem)
            })
            .filter((elem, index, self) => self.indexOf(elem) === index);

        if (shouldRepeat) {
            resolveActions.push(ResolveAction.REPEAT);
        }

        return resolveActions;
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

    static extractErrorsFromErrorObject(errorObject) {
        if (!errorObject || !errorObject.response || !Array.isArray(errorObject.response.errors)) {
            logger.error('Error object has not the expected form. Can not handle error: ' + errorObject);
            return null;
        }

        return errorObject.response.errors;
    }

}

exports.ErrorResolver = ErrorResolver;

const logger = require('../../../LoggerProvider').getLogger(ErrorResolver);
