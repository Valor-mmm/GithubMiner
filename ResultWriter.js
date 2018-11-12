const FileHandler = require('./FileHandler');

class ResultWriter {

    constructor(resultDirPath, commitThreashold) {
        this.resultDirPath = resultDirPath;
        this.result = {};
        this.repoList = [];
        this.notFoundList = [];
        this.lastCommit = 0;
        this.commitThreashold = commitThreashold;
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
            console.info('Repo List is empty and could not be written!');
            return null;
        }
        FileHandler.appendTOJSON(this.resultDirPath + 'repoList.json', this.repoList);
    }

    writeNotFoundList() {
        if (!Array.isArray(this.notFoundList || this.notFoundList.length < 1)) {
            console.info('Not found List is empty and could not be written!');
            return null;
        }
        FileHandler.appendTOJSON(this.resultDirPath + 'notFoundList.json', this.notFoundList);
    }

    appendResult(partialResult) {
        if (!(typeof partialResult === 'object')) {
            console.log('Could not append to result. Parameter has to be an object.');
            return null;
        }

        Object.assign(this.result, partialResult);
        const objectSize = Object.keys(this.result).length;
        if ( objectSize - this.lastCommit > this.commitThreashold) {
            this.commit();
            this.lastCommit = objectSize;
            console.log('Committed temporarily at size: ' + objectSize);
        }
    }

    appendRepoList(partialRepoList) {
        if (!Array.isArray(partialRepoList)) {
            console.log('Could not append to repo List. Parameter has to be an array.');
            return null;
        }

        this.notFoundList = this.repoList.concat(partialRepoList);
    }

    appendNotFoundList(partialNotFoundList) {
        if (!Array.isArray(partialNotFoundList)) {
            console.log('Could not append to notFound List. Parameter has to be an array.');
            return null;
        }

        this.notFoundList = this.notFoundList.concat(partialNotFoundList);
    }

}

module.exports = ResultWriter;