const FileHandler = require('./FileHandler').FileHander;
const lodashConcatArrayCustomizer = require('./FileHandler').lodashConcatArrayCustomizer;
const _ = require('lodash');

class ResultWriter {

    constructor(resultDirPath, commitThreshold) {
        this.resultDirPath = resultDirPath;
        this.result = {};
        this.errorList = [];
        this.notFoundList = [];
        this.commitThreshold = commitThreshold;
    }

    commit() {
        this.writeResult();
        this.writeErrorList();
        this.writeNotFoundList();
        this.reset();
    }

    reset() {
        this.result = {};
        this.errorList = [];
        this.notFoundList = [];
    }

    writeResult() {
        FileHandler.appendTOJSON(this.resultDirPath + 'result.json', this.result);
    }

    writeErrorList() {
        if (!Array.isArray(this.errorList || this.errorList.length < 1)) {
            logger.info('Repo List is empty and could not be written!');
            return null;
        }
        FileHandler.appendTOJSON(this.resultDirPath + 'errorList.json', this.errorList);
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

        this.result = _.mergeWith(this.result, partialResult, lodashConcatArrayCustomizer);
        const resultSize = Object.keys(this.result).length;
        if ( resultSize > this.commitThreshold) {
            this.commit();
            logger.log('Committed during execution at size: ' + resultSize);
        }
    }

    appendErrorList(partialErrorList) {
        if (!Array.isArray(partialErrorList)) {
            logger.log('Could not append to errorList. Parameter has to be an array.');
            return null;
        }

        this.errorList = this.errorList.concat(partialErrorList);
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