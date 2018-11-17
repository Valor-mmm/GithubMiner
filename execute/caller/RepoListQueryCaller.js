const RepoQueryCaller = require('./RepoQueryCaller').RepoQueryCaller;
const QueryType = require('../../github/query/QueryType').QueryType;
const ConfigMerger = require('../ConfigMerger');
const RepoListReader = require('../../repoList/RepoListReader');
const ResultWriter = require('../../ResultWriter').ResultWriter;
const ErrorResolver = require('../../github/endpoint/errorHandling/ErrorResolver').ErrorResolver;
const QueryCaller = require('./QueryCaller').QueryCaller;

const shortId = require('shortid');

const defaultConfig = {
    apiConfigLocation: void 0,
    propertyName: void 0,
    separationSize: 100,
    outputDirPath: `./result/`,
    commitThreshold: 1000
};

class RepoListQueryCaller extends QueryCaller {

    static async call(query, repoListLocation, config) {
        if (!query) {
            logger.error('Query is needed for the RepoListQueryCaller to call a query.');
            return null;
        }

        const mergedConfig = ConfigMerger.mergeConfig(config, defaultConfig);
        const repoList = mergedConfig.propertyName ?
            RepoListReader.getRepoList(repoListLocation, mergedConfig.propertyName) : RepoListReader.getRepoList(repoListLocation);
        logger.log('Executing repoList of size: ' + repoList.length);
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

            logger.log(`Executing repoList from ${courser} to ${sliceEnd}`);
            await this._handleExecution(repoList.slice(courser, sliceEnd), executorConfig, query, resultWriter, false);
            courser += separationSize;
        }
        resultWriter.commit();
        return true;
    }

    static async _handleExecution(partialRepoList, config, query, resultWriter) {
        const result = await RepoQueryCaller.call(query, partialRepoList, config, resultWriter);
        logger.info('Partial call was successful: ' + result);
        return result;
    }

}

exports.RepoListQueryCaller = RepoListQueryCaller;

const logger = require('../../LoggerProvider').getLogger(RepoListQueryCaller);
