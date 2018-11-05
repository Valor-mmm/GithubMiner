const RepoQueryExecutor = require('./RepoQueryExecutor');
const QueryType = require('../github/query/QueryType');
const ConfigMerger = require('./ConfigMerger');
const RepoListReader = require('../repoList/RepoListReader');

const defaultConfig = {
    apiConfigLocation: void 0,
    outputFilePath: void 0,
    propertyName: void 0,
};

class RepoListQueryExecutor {

    static execute(query, repoListLocation, config) {
        if (!query) {
            console.error('Query is needed for the RepoListQueryExecutor to execute a query.');
            return null;
        }
        if (!(typeof query === 'string') && !(query instanceof QueryType)) {
            console.error('Query parameter has to be a query as string, or a QueryType instance.');
            return null;
        }

        const mergedConfig = ConfigMerger.mergeConfig(config, defaultConfig);
        const repoList = mergedConfig.propertyName ?
            RepoListReader.getRepoList(repoListLocation, mergedConfig.propertyName) : RepoListReader.getRepoList(repoListLocation);
        return RepoQueryExecutor.execute(query, repoList, {apiConfigLocation: mergedConfig.apiConfigLocation});
    }

}

module.exports = RepoListQueryExecutor;