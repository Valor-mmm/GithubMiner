const ResultWriter = require('./ResultWriter').ResultWriter;
const PaginationQueryType = require('./github/query/pagination/PaginationQueryType').PaginationQueryType;
const RepositoryDescriptor = require('./github/RepositoryDescriptor').RepositoryDescriptor;

class WithPaginationResultWriter extends ResultWriter {

    constructor(resultWriter, paginationQuery, repoList, paginationSize) {
        super(null, null);
        if (!resultWriter || !(resultWriter instanceof ResultWriter)) {
            const errMsg = 'Mandatory parameter resultWriter has to be defined and an instance of ResultWriter.';
            logger.error(errMsg);
            throw new Error(errMsg);
        }

        if (!paginationQuery || !(paginationQuery instanceof PaginationQueryType)) {
            const errMsg = 'Mandatory parameter paginationQuery has to be defined and an instance of PaginationQueryType.';
            logger.error(errMsg);
            throw new Error(errMsg);
        }

        if (!Array.isArray(repoList)) {
            const errMsg = 'Mandatory parameter repoList has to be an Array of RepositoryDescriptors.';
            logger.error(errMsg);
            throw new Error(errMsg);
        }

        const isArrayOfRepoDescriptors = repoList.every(elem => elem instanceof RepositoryDescriptor);
        if (!isArrayOfRepoDescriptors) {
            const errMsg = 'Array parameter repoList has to contain only RepositoryDescriptors.';
            logger.error(errMsg);
            throw new Error(errMsg)
        }

        this.resultWriter = resultWriter;
        this.paginationQuery = paginationQuery;
        this.repoList = repoList;
        this.paginationDescriptor = null;
        this.paginationSize = paginationSize;
    }

    commit() {
        this.resultWriter.commit();
    }

    reset() {
        this.resultWriter.reset();
    }

    updatePaginationInfo(partialResult) {
        this.paginationDescriptor = this.paginationQuery.extractPaginationInfo(partialResult, this.repoList, this.paginationSize);
    }

    appendResult(partialResult) {
        this.updatePaginationInfo(partialResult);
        this.resultWriter.appendResult(partialResult);
    }

    appendErrorList(partialErrorList) {
        this.resultWriter.appendErrorList(partialErrorList)
    }

    appendNotFoundList(partialNotFoundList) {
        this.resultWriter.appendNotFoundList(partialNotFoundList);
    }

    writeResult() {
        this.resultWriter.writeResult();
    }

    writeErrorList() {
        this.resultWriter.writeErrorList();
    }

    writeNotFoundList() {
        this.resultWriter.writeNotFoundList();
    }
}

exports.WithPaginationResultWriter = WithPaginationResultWriter;

const logger = require('./LoggerProvider').getLogger(WithPaginationResultWriter);