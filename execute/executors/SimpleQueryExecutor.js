const QueryExecutor = require('./QueryExecutor').QueryExecutor;
const QueryType = require('../../github/query/QueryType').QueryType;
const RepoQueryGenerator = require('../../github/query/RepoQueryGenerator').RepoQueryGenerator;

class SimpleQueryExecutor extends QueryExecutor {

    static composeQuery(query, repoList) {
        if (typeof query === 'string') {
            return query;
        }

        if (!(query instanceof QueryType)) {
            logger.error('query has to be either a string or an instance of QueryType');
            return null;
        }

        if (!Array.isArray(repoList) || repoList.length < 1) {
            logger.error('An array of repository descriptors(repoList) is needed to create a query.');
            return null;
        }

        return RepoQueryGenerator.createQuery(query, repoList);
    }

    static async execute(query, data, resultWriter, options) {
        const composedQuery = SimpleQueryExecutor.composeQuery(query, data);
        return await super.callEndpoint(composedQuery, resultWriter, options);
    }

}

exports.SimpleQueryExecutor = SimpleQueryExecutor;

const logger = require('../../LoggerProvider').getLogger(SimpleQueryExecutor);