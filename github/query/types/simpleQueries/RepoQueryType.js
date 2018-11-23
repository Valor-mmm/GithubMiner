const QueryType = require('../../QueryType');
const FragmentGenerator = require('../../RepoFragmentGenerator');

class RepoQueryType extends QueryType {

    composeFragments() {
        return FragmentGenerator.getRepoFragment('').content;
    }

    composeRepositoryQuery(repo) {
        const content = '...' + FragmentGenerator.getRepoFragment('').name;
        return QueryType.fillRepoQueryTemplate(repo, content);
    }
}

module.exports = RepoQueryType;