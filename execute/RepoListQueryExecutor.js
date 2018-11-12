const RepoQueryExecutor = require('./RepoQueryExecutor');
const QueryType = require('../github/query/QueryType');
const ConfigMerger = require('./ConfigMerger');
const RepoListReader = require('../repoList/RepoListReader');
const ResultWriter = require('../ResultWriter');
const ErrorHandler = require('../github/endpoint/errorHandling/ErrorHandler');

const shortId = require('shortid');

const defaultConfig = {
    apiConfigLocation: void 0,
    propertyName: void 0,
    separationSize: 100,
    outputDirPath: `./result/`,
    commitThreshold: 1000
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
        console.log('Executing repoList of size: ' + repoList.length);
        const resultWriter = new ResultWriter(mergedConfig.outputDirPath, mergedConfig.commitThreshold);
        return await this._repeatedExecute(mergedConfig, repoList, query, resultWriter);
    }

    static async _repeatedExecute(config, repoList, query, resultWriter) {
        const separationSize = config.separationSize;
        const executorConfig = {apiConfigLocation: config.apiConfigLocation, tokenSwitchId: shortId.generate()};
        let courser = 0;
        let sliceEnd;
        while (courser < repoList.length) {
            if (courser + separationSize > repoList.length) {
                sliceEnd = repoList.length;
            } else {
                sliceEnd = courser + separationSize;
            }

            console.log(`Executing repoList from ${courser} to ${sliceEnd}`);
            await this._handleExecution(repoList.slice(courser, sliceEnd), executorConfig, query, resultWriter, false);
            courser += separationSize;
        }
        resultWriter.commit();
    }

    static async _handleExecution(partialRepoList, executorConfig, query, resultWriter, isRepeat) {
        const endpointResult = RepoQueryExecutor.execute(query, partialRepoList, executorConfig, isRepeat);
        if (!endpointResult) {
            console.error(`Could not start query for repoList: "${partialRepoList}"`);
        } else {
            try {
                const result = await endpointResult;
                await this.handleSuccess(resultWriter, result);
                return true;
            } catch (e) {
                const shouldRepeat = ErrorHandler.handleErrors(resultWriter, e);
                if (shouldRepeat && isRepeat) {
                    console.error('Repeating did not work. Still a timeout');
                } else if (shouldRepeat) {
                    console.log('Query will be repeated.');
                    console.log('Waiting 5 seconds.');
                    await this.sleepFor(5000);
                    console.log('Repeat query.');
                    return this._handleExecution(partialRepoList, executorConfig, query, resultWriter, true);
                }
                return false;
            }
        }
    }

    static sleepFor(ms){
        return new Promise(resolve=>{
            setTimeout(resolve,ms)
        })
    }

    static async handleSuccess(resultWriter, result) {
        if (!result || typeof result !== 'object') {
            console.error('Unexpected result: ' + result);
        }
        resultWriter.appendResult(result);
    }

}

module.exports = RepoListQueryExecutor;