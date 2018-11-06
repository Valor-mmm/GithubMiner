const FileHandler = require('./FileHandler');

class ResultWriter {

    constructor(resultDirPath) {
        this.resultDirPath = resultDirPath;
        this.result = {};
        this.repoList = [];
        this.notFoundList = [];
    }

    commit() {
        this.writeResult();
        this.writeRepoList();
        this.writeNotFoundList();
    }

    writeResult() {
        FileHandler.writeToJSON(this.resultDirPath + 'result.json', JSON.stringify(this.result));
    }

    writeRepoList() {
        if (!Array.isArray(this.repoList || this.repoList.length < 1)) {
            console.info('Repo List is empty and could not be written!');
            return null;
        }
        FileHandler.writeToJSON(this.resultDirPath + 'repoList.json', JSON.stringify(this.repoList));
    }

    writeNotFoundList() {
        if (!Array.isArray(this.notFoundList || this.notFoundList.length < 1)) {
            console.info('Not found List is empty and could not be written!');
            return null;
        }
        FileHandler.writeToJSON(this.resultDirPath + 'notFoundList.json', JSON.stringify(this.notFoundList));
    }

    appendResult(partialResult) {
        if (!(typeof partialResult === 'object')) {
            console.log('Could not append to result. Parameter has to be an object.');
            return null;
        }

        Object.assign(this.result, partialResult);
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