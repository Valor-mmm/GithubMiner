const RepositoryDescriptor = require('./RepositoryDescriptor');

const fragment = `fragment repository on Repository {
                    name
                    nameWithOwner
                    description
                    createdAt
                    updatedAt
                    isFork
            }`;

class ContributorQuery {

    static createQuery(repositoryDescriptorList) {
        if (!Array.isArray(repositoryDescriptorList) || repositoryDescriptorList.length === 0) {
            console.error('RepositoryDescriptorList has to include at least one RepositoryDescriptor but was: ' + repositoryDescriptorList);
            return null;
        }
        let queryString = `${fragment}\n{`;
        for (const repo of repositoryDescriptorList) {
            if (!(repo instanceof RepositoryDescriptor)) {
                console.error('Repository list has to contain only RepositoryDescriptor objects!');
                continue;
            }
            queryString += ContributorQuery.getRepositoryQuery(repo)
        }
        queryString += '}';
        return queryString;
    }

    static getRepositoryQuery(repoDescriptor) {
        if (!(repoDescriptor instanceof RepositoryDescriptor)) {
            console.error(`Parameter has to be a RepositoryDescriptor`);
            return '';
        }

        return `${repoDescriptor.getDisplayValue()}: repository(owner: "${repoDescriptor.owner}", name: "${repoDescriptor.name}") {
            ...repository
        }`
    }
}

module.exports = ContributorQuery;