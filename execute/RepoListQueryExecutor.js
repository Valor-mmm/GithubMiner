const RepoQueryExecutor = require('./RepoQueryExecutor');
const QueryType = require('../github/query/QueryType');
const ConfigMerger = require('./ConfigMerger');
const RepoListReader = require('../repoList/RepoListReader');
const ResultWriter = require('../ResultWriter');
const ErrorHandler = require('../github/endpoint/errorHandling/ErrorHandler');

const defaultConfig = {
    apiConfigLocation: void 0,
    outputFilePath: void 0,
    propertyName: void 0,
    separationSize: 100,
    outputDirPath: `./result/`
};

class RepoListQueryExecutor {

    static async execute(query, repoListLocation, config) {
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
        const resultWriter = new ResultWriter(mergedConfig.outputDirPath);
        return await this._repeatedExecute(mergedConfig, repoList, query, resultWriter);
    }

    static async _repeatedExecute(config, repoList, query, resultWriter) {
        const separationSize = config.separationSize;
        const executorConfig = {apiConfigLocation: config.apiConfigLocation};
        let courser = 0;
        let sliceEnd;
        while (courser < repoList.length) {
            if (courser + separationSize > repoList.length) {
                sliceEnd = repoList.length;
            } else {
                sliceEnd = courser + separationSize;
            }

            console.log(`Executing repoList from ${courser} to ${sliceEnd}`);
            await this._handleExecution(repoList.slice(courser, sliceEnd), executorConfig, query, resultWriter, 0);
            courser += separationSize;
        }
        resultWriter.commit();
    }

    static async _handleExecution(partialRepoList, executorConfig, query, resultWriter, repeatCounter) {
        const endpointResult = RepoQueryExecutor.execute(query, partialRepoList, executorConfig);
        if (!endpointResult) {
            console.error(`Could not start query for repoList: "${partialRepoList}"`);
        } else {
            try {
                const result = await endpointResult;
                await this.handleSuccess(resultWriter, result);
                return true;
            } catch (e) {
                const shouldRepeat = ErrorHandler.handleErrors(resultWriter, e);
                if (shouldRepeat && repeatCounter < 5) {
                    console.log(`Repeating times: ${repeatCounter}`);
                    return this._handleExecution(partialRepoList, executorConfig, query, resultWriter, repeatCounter + 1);
                }
                return false;
            }
        }
    }

    static async handleSuccess() {
        debugger;
    }

}

module.exports = RepoListQueryExecutor;