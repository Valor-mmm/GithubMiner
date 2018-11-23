const RepositoryDescriptor = require('../../RepositoryDescriptor').RepositoryDescriptor;

class PaginationDescriptor {

    constructor(paginationSize) {
        if ((paginationSize || paginationSize === 0) && (typeof paginationSize !== 'number')) {
            logger.warn('Given pagination size was not a number.', paginationSize);
            paginationSize = null;
        }
        this.enumMap = {};
        this.repoSet = new Set();
        this.paginationSize = paginationSize || 100;
    }

    addPaginationValue(paginationEnum, paginationInfo, repositoryDescriptor) {
        if (!paginationEnum || !(typeof paginationEnum === 'object')) {
            logger.error('Mandatory parameter paginationEnum has to be a PaginationEnum.', paginationEnum);
            return false;
        }

        if (!paginationInfo || !(typeof paginationInfo === 'object')) {
            logger.error('Mandatory parameter paginationInfo is not as the expected type.', paginationInfo);
            return false;
        }

        if (!repositoryDescriptor || !(repositoryDescriptor instanceof RepositoryDescriptor)) {
            logger.error('Mandatory parameter repositoryDescriptor has to be defined and an instance of RepositoryDescriptor');
            return false;
        }

        const paginationValue = {
            repositoryDescriptor: repositoryDescriptor,
            paginationInfo: paginationInfo,
            paginationEnum: paginationEnum
        };

        if (paginationInfo.hasNextPage) {
            this.repoSet.add(repositoryDescriptor);
        }

        if (!this.enumMap.hasOwnProperty(paginationEnum.toString())) {
            this.enumMap[paginationEnum.toString()] = {};
        }
        this.enumMap[paginationEnum.toString()][repositoryDescriptor.getDisplayValue()] = paginationValue;
    }

    hasNextPage() {
        for (const paginationEnumString in this.enumMap) {
            if (!this.enumMap.hasOwnProperty(paginationEnumString)) {
                continue;
            }
            const enumMap = this.enumMap[paginationEnumString];
            for (const displayValue in enumMap) {
                if (!enumMap.hasOwnProperty(displayValue)) {
                    continue;
                }
                if (!enumMap[displayValue].hasOwnProperty('paginationInfo')) {
                    continue;
                }

                if (enumMap[displayValue]['paginationInfo'].hasNextPage) {
                    return true;
                }
            }
        }
        return false;
    }

    composeRepositoryList() {
        const result = [];
        for (const elem of this.repoSet.values()) {
            result.push(elem);
        }
        return result;
    }
}

exports.PaginationDescriptor = PaginationDescriptor;

const logger = require('../../../LoggerProvider').getLogger(PaginationDescriptor);