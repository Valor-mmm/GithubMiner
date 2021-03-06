const RepositoryDescriptor = require('../RepositoryDescriptor').RepositoryDescriptor;

class QueryType {

    composeFragments() {
        // has to be overwritten by extending classes
        throw new QueryTypeAbstractError('composeFragments');
    }

    composeRepositoryQuery(repo) {
        // has to be overwritten by extending classes
        throw new QueryTypeAbstractError('composeRepositoryQuery');
    }

    static fillRepoQueryTemplate(repoDescriptor, content) {
        if (!(repoDescriptor instanceof RepositoryDescriptor)) {
            logger.error(`Mandatory parameter "repoDescriptor" has to be a RepositoryDescriptor.`);
            return '';
        }

        if (!content || typeof content !== 'string') {
            logger.error('Mandatory parameter "content" has to be of type string.');
            return '';
        }

        return `${repoDescriptor.getDisplayValue()}: repository(owner: "${repoDescriptor.owner}", name: "${repoDescriptor.name}") {
            ${content}
        }`;
    }

}

class QueryTypeAbstractError extends Error {
    constructor(methodName) {
        super();
        this.message = `Method "${methodName}" of class QueryType is "abstract". Please use subclasses and overwrite method there.`;
    }
}

exports.QueryType = QueryType;

const logger = require('../../LoggerProvider').getLogger(QueryType);