const QueryType = require('../../github/query/QueryType').QueryType;
const PaginationQueryType = require('../../github/query/pagination/PaginationQueryType').PaginationQueryType;
const SimpleQueryExecutor = require('./SimpleQueryExecutor').SimpleQueryExecutor;
const PaginationQueryExecutor = require('./PaginationQueryExecutor').PaginationQueryExecutor;

class QueryExecutorFactory {

    static getInstance(query) {
        if (!query) {
            logger.error('Mandatory parameter query is missing. ' + query);
            return null;
        }

        if (query instanceof QueryType || typeof query === 'string') {
            return SimpleQueryExecutor;
        }

        if (query instanceof PaginationQueryType) {
            return PaginationQueryExecutor;
        }

        logger.error('Instance of parameter "query" is unknown.' + typeof query);
        return null;
    }

}

exports.QueryExecutorFactory = QueryExecutorFactory;

const logger = require('../../LoggerProvider').getLogger(QueryExecutorFactory);
