const GithubEndpoint = require('../../github/endpoint/GithubEndpoint').GithubEndpoint;
const ErrorResolver = require('../../github/endpoint/errorHandling/ErrorResolver').ErrorResolver;
const ResolveAction = require('../../github/endpoint/errorHandling/ResolveAction');
const ResultWriter = require('../../ResultWriter').ResultWriter;

class QueryExecutor {

    static async execute(query, data, resultWriter, options) {
        /*
            options: {
                fetchOptions
                switchApiToken,
                apiConfig
            }
        * */

        const errMsg = 'Not implemented! This function has to be overwritten by all subclasses!';
        logger.error(errMsg);
        throw new Error(errMsg);
    }

    /**
     * Calls the github endpoint using given parameters
     * @param queryString: String - The query to send
     * @param resultWriter: ResultWriter - Class to add result and errors
     * @param options object like this {
     *     apiConfig: the apiConfig object
     *     fetchOptions: options for the fetch request
     *     switchApiToken: boolean - is the api token should be switched
     * }
     * @returns {Promise<boolean>}
     */
    static async callEndpoint(queryString, resultWriter, options) {
        if (!options) {
            logger.warn('No options have been given to call the endpoint.');
            options = {};
        }

        if (!resultWriter || !(resultWriter instanceof ResultWriter)) {
            logger.error('Can not write a result without a result writer! Will not query endpoint.');
            return false;
        }

        try {
            const result = await GithubEndpoint.callEndpoint(options.apiConfig, options.fetchOptions, queryString, options.switchApiToken);
            await this.handleSuccess(resultWriter, result);
            return true;
        } catch(e) {
            return await this.handleError(e, queryString, resultWriter, options);
        }
    }

    static async handleSuccess(resultWriter, result) {
        if (!result || typeof result !== 'object') {
            logger.error('Unexpected result: ' + result);
        }
        resultWriter.appendResult(result);
    }

    static async handleError(error, queryString, resultWriter, options) {
        const resolveActions = ErrorResolver.handleErrors(resultWriter, error);
        return await QueryExecutor.iterateResolveActions(resolveActions, error, queryString, resultWriter, options);

    }

    static async iterateResolveActions(resolveActions, error, queryString, resultWriter, options) {
        if (!Array.isArray(resolveActions)) {
            logger.error('No valid resolve actions could be acquired. Could not handle error!');
            return false;
        }

        resolveActions.sort((a, b) => a.order - b.order);
        let switchApiToken = false;

        for (const action of resolveActions) {
            switch (action) {
                case ResolveAction.ABORT:
                    logger.info('Aborting further program execution.');
                    throw new Error('Program execution aborted due to severe error: ' + JSON.stringify(error));
                case ResolveAction.IGNORE:
                    logger.info("Ignoring error.");
                    return true;
                case ResolveAction.PERSIST_ERROR:
                    QueryExecutor.persistError(error, queryString, resultWriter);
                    break;
                case ResolveAction.REPEAT:
                    await QueryExecutor.retry(queryString, resultWriter, options);
                    break;
                case ResolveAction.SWITCH_API_TOKEN:
                    switchApiToken = true;
                    break;
                case ResolveAction.RESOLVE:
                    logger.info('Error resolved.');
                    return true;
                default:
                    logger.error('No resolve action found!. Could not handle error properly!');
                    return false;
            }
        }
        return false;
    }

    static persistError(error, queryString, resultWriter) {
        if (!resultWriter || !(resultWriter instanceof ResultWriter)) {
            logger.error('Can not persist error, because resultWriter is not present.' + resultWriter);
            return;
        }

        resultWriter.appendErrorList({
            errors: ErrorResolver.extractErrorsFromErrorObject(error),
            queryString: queryString
        });
    }

    static async retry(queryString, resultWriter, options) {
        const retryCounter = options && options.retryCounter ? options.retryCounter : 1;
        if (retryCounter > 4) {
            logger.error('Retried 3 Times already. Quitting now.');
            return;
        }

        options.retryCounter = retryCounter + 1;
        logger.log(`Retrying for the ${retryCounter}th time.`);
        await QueryExecutor.callEndpoint(queryString, resultWriter, options);
    }

}

exports.QueryExecutor = QueryExecutor;

const logger = require('../../LoggerProvider').getLogger(QueryExecutor);