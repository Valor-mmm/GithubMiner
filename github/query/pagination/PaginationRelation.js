const PaginationDescriptor = require('./PaginationDescriptor').PaginationDescriptor;
const RepositoryDescriptor = require('../../RepositoryDescriptor').RepositoryDescriptor;

class PaginationRelation {
    constructor(paginationEnum, paginationValue, displayValue) {
        if (!paginationEnum || !(typeof paginationEnum === 'object') || !paginationEnum.toString) {
            const errMsg = 'Mandatory constructor parameter paginationEnum is not a object containing toString';
            logger.error(errMsg, paginationEnum);
            throw new PaginationRelationError(errMsg);
        }

        if (!paginationValue || !(typeof paginationValue === 'string')) {
            const errMsg = 'Mandatory constructor parameter paginationValue missing or not of type string.';
            logger.error(errMsg, paginationValue);
            throw new PaginationRelationError(errMsg);
        }

        if (!displayValue || !(typeof displayValue === 'string')) {
            const errMsg = 'Mandatory parameter displayValue has to be defined and of type string.';
            logger.error(errMsg, displayValue);
            throw new PaginationRelationError(errMsg);
        }

        this.paginationEnum = paginationEnum;
        this.paginationValue = paginationValue;
        this.displayValue = displayValue;
    }

    static fromRepoList(repoList, paginationEnum, paginationSize=100) {
        if (!Array.isArray(repoList)) {
            logger.error('Mandatory parameter has to be defined and an array.');
            return null;
        }

        if (!paginationEnum || !(typeof paginationEnum === 'object')) {
            logger.error('Mandatory parameter paginationEnum has to be an enum.');
        }

        if (!paginationSize || !(typeof paginationSize === 'number')) {
            logger.error('PaginationSize has to be defined and a number.');
            return null;
        }

        const result = [];
        for (const repoDescriptor of repoList) {
            if (!repoDescriptor || !(repoDescriptor instanceof RepositoryDescriptor)) {
                logger.error('Parameter repoList has to be an array of repositoryDescriptors but found: ' + repoDescriptor);
                continue;
            }

            result.push(new PaginationRelation(paginationEnum, `first: ${paginationSize}`, repoDescriptor.getDisplayValue()))
        }

        return result;
    }

    static fromPaginationDescriptor(paginationDescriptor) {
        if (!paginationDescriptor || !(paginationDescriptor instanceof PaginationDescriptor)) {
            logger.error('Mandatory parameter paginationDescriptor has to be defined and an instance of PaginationDescriptor', paginationDescriptor);
            return null;
        }

        const result = [];

        for (const enumName in paginationDescriptor.enumMap) {
            if (paginationDescriptor.enumMap.hasOwnProperty(enumName)) {
                const enumValues = paginationDescriptor.enumMap[enumName];
                for (const value in enumValues) {
                    if (enumValues.hasOwnProperty(value)) {
                        const content = enumValues[value];
                        const paginationValue = PaginationRelation.composePaginationValue(content.paginationInfo, paginationDescriptor.paginationSize);
                        const displayValue = content.repositoryDescriptor.getDisplayValue();
                        if (!displayValue || !paginationValue) {
                            console.debug('Could not determine a pagination value. Skipping entry.');
                            continue;
                        }
                        result.push(new PaginationRelation(content.paginationEnum, paginationValue, displayValue));
                    }
                }
            }
        }

        return result;
    }

    static composePaginationValue(paginationInfo, paginationSize=100) {
        if (!paginationInfo || !(typeof paginationInfo === 'object')) {
            logger.error('');
            return null;
        }

        if (!paginationInfo.hasNextPage) {
            logger.debug('paginationInfo does not have a next page.');
            return null;
        }

        if (!paginationInfo.endCursor) {
            logger.error('paginationInfo has a next page but not an endCourser.');
            return null;
        }

        if (!paginationSize || !(typeof paginationSize === 'number')) {
            logger.error('');
            return null;
        }

        logger.debug('Creating paginationValue for size of ' + paginationSize);
        return `first: ${paginationSize} after: "${paginationInfo.endCursor}"`;
    }


}

class PaginationRelationError extends Error {
    constructor(message) {
        super();
        this.message = message;
    }
}

exports.PaginationRelation = PaginationRelation;

const logger = require('../../../LoggerProvider').getLogger(PaginationRelation);