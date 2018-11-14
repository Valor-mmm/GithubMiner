const QueryType = require('../../github/query/QueryType');
const ConfigMerger = require('../ConfigMerger');
const RepoQueryGenerator = require('../../github/query/RepoQueryGenerator');
const GithubConfigProvider = require('../../github/endpoint/config/GithubConfigProvider');
const GithubEndpoint = require('../../github/endpoint/GithubEndpoint');

const defaultConfig = {
    apiConfigLocation: void 0,
    tokenSwitchId: void 0,
    options: {timeout: 0}
};

class RepoQueryCaller {

    static execute(query, repoList , config, switchApiToken) {
        if (!query) {
            console.error('Query is needed for the RepoQueryCaller to execute a query.');
            return null;
        }
        if (!(typeof query === 'string') && !(query instanceof QueryType)) {
            console.error('Query parameter has to be a query as string, or a QueryType instance.');
            return null;
        }

        if (!Array.isArray(repoList) || repoList.length < 1) {
            console.error('An array of repository descriptors(repoList) is needed to execute the query.');
            return null;
        }

        const mergedConfig = ConfigMerger.mergeConfig(config, defaultConfig);
        const composedQuery = RepoQueryCaller.composeQuery(query, repoList);
        const apiConfig = GithubConfigProvider.readConfig(mergedConfig.apiConfigLocation);
        apiConfig.tokenSwitchId = mergedConfig.tokenSwitchId;

        return GithubEndpoint.callEndpoint(apiConfig, mergedConfig.options, composedQuery, switchApiToken);
    }

    static composeQuery(query, repoList) {
        if (typeof query === 'string') {
            return query;
        }

        if (!(query instanceof QueryType)) {
            console.error('query has to be either a string or an instance of QueryType');
            return null;
        }

        if (!Array.isArray(repoList) || repoList.length < 1) {
            console.error('An array of repository descriptors(repoList) is needed to create a query.');
            return null;
        }

        return RepoQueryGenerator.createQuery(query, repoList);
    }
}

module.exports = RepoQueryCaller;