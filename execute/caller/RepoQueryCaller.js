const QueryType = require('../../github/query/QueryType').QueryType;
const PaginationQueryType = require('../../github/query/pagination/PaginationQueryType').PaginationQueryType;
const ConfigMerger = require('../ConfigMerger');
const GithubConfigProvider = require('../../github/endpoint/config/GithubConfigProvider');
const QueryExecutorFactory = require('../executors/QueryExecutorFactory').QueryExecutorFactory;
const QueryCaller = require('./QueryCaller').QueryCaller;

const defaultConfig = {
    apiConfigLocation: void 0,
    tokenSwitchId: void 0,
    options: {timeout: 0},
    switchApiToken: false
};

class RepoQueryCaller extends QueryCaller {

    static call(query, repoList , config, resultWriter) {
        if (!query) {
            logger.error('Query is needed for the RepoQueryCaller to call a query.');
            return null;
        }
        if (!(typeof query === 'string') && !(query instanceof QueryType) && !(query instanceof PaginationQueryType)) {
            logger.error('Query parameter has to be a query as string, or a (Pagination)QueryType instance.');
            return null;
        }

        if (!Array.isArray(repoList) || repoList.length < 1) {
            logger.error('An array of repository descriptors(repoList) is needed to call the query.');
            return null;
        }

        const mergedConfig = ConfigMerger.mergeConfig(config, defaultConfig);
        const apiConfig = GithubConfigProvider.readConfig(mergedConfig.apiConfigLocation);
        apiConfig.tokenSwitchId = mergedConfig.tokenSwitchId;
        const queryExecutor = QueryExecutorFactory.getInstance(query);

        if (!queryExecutor) {
            logger.error('Can not call endpoint, because no fitting QueryExecutor could be found for given query: ' + query);
            return null;
        }

        const options = {
            switchApiToken: mergedConfig.switchApiToken,
            apiConfig: apiConfig,
            fetchOptions: mergedConfig.options,
        };

        return queryExecutor.execute(query, repoList, resultWriter, options);
    }
}

exports.RepoQueryCaller = RepoQueryCaller;

const logger = require('../../LoggerProvider').getLogger(RepoQueryCaller);
