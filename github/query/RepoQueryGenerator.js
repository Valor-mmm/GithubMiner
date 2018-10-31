const QueryType = require('./QueryType');
const RepositoryDescriptor = require('../RepositoryDescriptor');

class RepoQueryGenerator {

    static createQuery(queryType, repoDescriptorArray) {
        if (!Array.isArray(repoDescriptorArray) || repoDescriptorArray.length === 0) {
            console.error('RepoDescriptorArray has to include at least one RepositoryDescriptor but was: ' + repoDescriptorArray);
            return null;
        }

        if (!queryType || !(queryType instanceof QueryType)) {
            console.error('Query type parameter has to be of type "QueryType".');
            return null;
        }

        let queryString = queryType.composeFragments() + '\n{';
        for (const repo of repoDescriptorArray) {
            if (!(repo instanceof RepositoryDescriptor)) {
                console.error('Repository list has to contain only RepositoryDescriptor objects!');
                continue;
            }
            queryString += queryType.composeRepositoryQuery(repo)
        }
        queryString += '}';
        return queryString;
    }

}

module.exports = RepoQueryGenerator;