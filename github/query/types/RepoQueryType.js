const QueryType = require('../QueryType');
const Fragments = require('../Fragments');

class RepoQueryType extends QueryType {

    composeFragments() {
        return Fragments.getRepoFragment('').content;
    }

    composeRepositoryQuery(repo) {
        const content = '...' + Fragments.getRepoFragment('').name;
        return QueryType.fillRepoQueryTemplate(repo, content);
    }
}

module.exports = RepoQueryType;