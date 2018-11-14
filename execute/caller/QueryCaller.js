class QueryCaller {

    static call(query, repoList, config) {
        const errMsg = 'Not implemented! This function has to be overwritten by all subclasses!';
        logger.error(errMsg);
        throw new Error(errMsg);
    }

}

exports.QueryCaller = QueryCaller;

const logger = require('../../LoggerProvider').getLogger(QueryCaller);