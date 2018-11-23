const QueryType = require('./QueryType').QueryType;
const RepositoryDescriptor = require('../RepositoryDescriptor').RepositoryDescriptor;
const PaginationQueryType = require('./pagination/PaginationQueryType').PaginationQueryType;

class RepoQueryGenerator {

    static createQuery(queryType, repoDescriptorArray) {
        if (!Array.isArray(repoDescriptorArray) || repoDescriptorArray.length === 0) {
            logger.error('RepoDescriptorArray has to include at least one RepositoryDescriptor but was: ' + repoDescriptorArray);
            return null;
        }

        if (!queryType || (!(queryType instanceof QueryType) && !(queryType instanceof PaginationQueryType))) {
            logger.error('Query type parameter has to be of type "(Pagination)QueryType".');
            return null;
        }

        let queryString = queryType.composeFragments() + '\n{';
        for (const repo of repoDescriptorArray) {
            if (!(repo instanceof RepositoryDescriptor)) {
                logger.error('Repository list has to contain only RepositoryDescriptor objects!');
                continue;
            }
            queryString += queryType.composeRepositoryQuery(repo)
        }
        queryString += '}';
        return queryString;
    }

}

exports.RepoQueryGenerator = RepoQueryGenerator;

const logger = require('../../LoggerProvider').getLogger(RepoQueryGenerator);
