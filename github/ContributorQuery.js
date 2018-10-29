const fragment =`fragment repository on Repository {
                    name
                    nameWithOwner
                    description
                    createdAt
                    updatedAt
                    isFork
            }`;

class ContributorQuery {

    static createQuery(repoList) {
        if (!repoList || Object.keys(repoList).length === 0) {
            console.error('Repolist has to include at least one repo but was: ' + repoList);
            return null;
        }
        let queryString = `${fragment}\n{`;
        for (const owner in repoList) {
            if (repoList.hasOwnProperty(owner)) {
                queryString += ContributorQuery.getRepositoryQuery(owner, repoList[owner])
            }
        }
        queryString += '}';
        return queryString;
    }

    static getRepositoryQuery(owner, name) {
        if (!owner || !name || !(typeof owner === 'string') || !(typeof name === 'string')) {
            console.error(`Some parameters are missing or not a string! owner: "${owner}" name: ${name}`);
            return '';
        }
        const displayOwner = owner.replace(/\W/g, '');
        const displayName = name.replace(/\W/g, '');
        return `${displayOwner}_${displayName}: repository(owner: "${owner}", name: "${name}") {
            ...repository
        }`
    }
}

module.exports = ContributorQuery;