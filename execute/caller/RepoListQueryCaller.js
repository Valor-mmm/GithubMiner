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
        if (!(typeof query === 'string') && !(query instanceof QueryType)) {
            logger.error('Query parameter has to be a query as string, or a QueryType instance.');
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
    }

    static async _handleExecution(partialRepoList, executorConfig, query, resultWriter, isRepeat) {
        const endpointResult = RepoQueryCaller.call(query, partialRepoList, executorConfig, isRepeat);
        if (!endpointResult) {
            logger.error(`Could not start query for repoList: "${partialRepoList}"`);
        } else {
            try {
                const result = await endpointResult;
                await this.handleSuccess(resultWriter, result);
                return true;
            } catch (e) {
                const shouldRepeat = ErrorResolver.handleErrors(resultWriter, e);
                if (shouldRepeat && isRepeat) {
                    logger.error('Repeating did not work. Still a timeout');
                } else if (shouldRepeat) {
                    logger.log('Query will be repeated.');
                    logger.log('Waiting 5 seconds.');
                    await this.sleepFor(5000);
                    logger.log('Repeat query.');
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
            logger.error('Unexpected result: ' + result);
        }
        resultWriter.appendResult(result);
    }

}

exports.RepoListQueryCaller = RepoListQueryCaller;

const logger = require('../../LoggerProvider').getLogger(RepoListQueryCaller);
