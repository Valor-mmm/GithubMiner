const FileHandler = require('./FileHandler').FileHander;

class ResultWriter {

    constructor(resultDirPath, commitThreshold) {
        this.resultDirPath = resultDirPath;
        this.result = {};
        this.repoList = [];
        this.notFoundList = [];
        this.lastCommit = 0;
        this.commitThreshold = commitThreshold;
    }

    commit() {
        this.writeResult();
        this.writeRepoList();
        this.writeNotFoundList();
    }

    writeResult() {
        FileHandler.appendTOJSON(this.resultDirPath + 'result.json', this.result);
    }

    writeRepoList() {
        if (!Array.isArray(this.repoList || this.repoList.length < 1)) {
            logger.info('Repo List is empty and could not be written!');
            return null;
        }
        FileHandler.appendTOJSON(this.resultDirPath + 'repoList.json', this.repoList);
    }

    writeNotFoundList() {
        if (!Array.isArray(this.notFoundList || this.notFoundList.length < 1)) {
            logger.info('Not found List is empty and could not be written!');
            return null;
        }
        FileHandler.appendTOJSON(this.resultDirPath + 'notFoundList.json', this.notFoundList);
    }

    appendResult(partialResult) {
        if (!(typeof partialResult === 'object')) {
            logger.log('Could not append to result. Parameter has to be an object.');
            return null;
        }

        Object.assign(this.result, partialResult);
        const objectSize = Object.keys(this.result).length;
        if ( objectSize - this.lastCommit > this.commitThreshold) {
            this.commit();
            this.lastCommit = objectSize;
            logger.log('Committed temporarily at size: ' + objectSize);
        }
    }

    appendRepoList(partialRepoList) {
        if (!Array.isArray(partialRepoList)) {
            logger.log('Could not append to repo List. Parameter has to be an array.');
            return null;
        }

        this.notFoundList = this.repoList.concat(partialRepoList);
    }

    appendNotFoundList(partialNotFoundList) {
        if (!Array.isArray(partialNotFoundList)) {
            logger.log('Could not append to notFound List. Parameter has to be an array.');
            return null;
        }

        this.notFoundList = this.notFoundList.concat(partialNotFoundList);
    }

}

exports.ResultWriter = ResultWriter;

const logger = require('./LoggerProvider').getLogger(ResultWriter);