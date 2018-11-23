const PaginationRelation = require('./PaginationRelation').PaginationRelation;

class PaginationQueryType {

    composeFragments() {
        // has to be overwritten by extending classes
        throw new PaginationQueryTypeAbstractError('composeFragments');
    }

    composeRepositoryQuery(repo) {
        // has to be overwritten by extending classes
        throw new PaginationQueryTypeAbstractError('composeRepositoryQuery');
    }

    extractPaginationInfo(responseData, repoList, paginationSize) {
        // has to be overwritten by extending classes
        throw new PaginationQueryTypeAbstractError('extractPaginationInfo');
    }

    getInitialEnums() {
        // has to be overwritten by extending classes
        throw new PaginationQueryTypeAbstractError('getInitialEnums');
    }

    static replacePagination(queryString, paginationRelationList) {
        if (!queryString || !(typeof queryString === 'string')) {
            logger.error('The mandatoryParameter queryString is not provided or not of type string.', queryString);
            return null;
        }

        if (!Array.isArray(paginationRelationList)) {
            logger.error('Mandatory paginationRelationList is missing or is not an array.');
            return null;
        }

        let resultString = queryString;
        for (const paginationRelation of paginationRelationList) {
            if (!(paginationRelation instanceof PaginationRelation)) {
                logger.warn('A value of the given paginationRelationList was not instanceof PaginationRelation.', paginationRelation);
                continue;
            }

            const replaceRegex = new RegExp(`(${paginationRelation.displayValue}:(?:.|\n)*?)${paginationRelation.paginationEnum.toString()}`);
            resultString = resultString.replace(replaceRegex, `$1${paginationRelation.paginationValue}`);
        }

        return resultString;
    }

}

class PaginationQueryTypeAbstractError extends Error {
    constructor(methodName) {
        super();
        this.message = `Method "${methodName}" of class QueryType is "abstract". Please use subclasses and overwrite method there.`;
    }
}

exports.PaginationQueryType = PaginationQueryType;

const logger = require('../../../LoggerProvider').getLogger(PaginationQueryType);