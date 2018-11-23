const QueryType = require('../../QueryType').QueryType;
const RepoFragmentGenerator = require('../../RepoFragmentGenerator');

class PopularityIndexQueryType extends QueryType {

    constructor() {
        super();
        this.fragmentList = PopularityIndexQueryType.getFragmentList();
    }

    composeFragments() {
        return this.fragmentList.map(elem => elem.content)
            .join('\n');
    }

    static getFragmentList() {
        const fragments = [];
        fragments.push(RepoFragmentGenerator.getGeneralFragment());
        fragments.push(RepoFragmentGenerator.getDefaultBranchCommitsFragment());
        fragments.push(RepoFragmentGenerator.getForkInfoFragment());
        fragments.push(RepoFragmentGenerator.getReleasesFragment());
        fragments.push(RepoFragmentGenerator.getStarsFragment());
        fragments.push(RepoFragmentGenerator.getTimeInfoFragment());
        fragments.push(RepoFragmentGenerator.getWatchersCountFragment());
        return fragments;
    }

    composeRepositoryQuery(repo) {
        const content = this.fragmentList.map(fragment => `...${fragment.name}`)
            .join('\n');
        return QueryType.fillRepoQueryTemplate(repo, content);
    }
}

module.exports = PopularityIndexQueryType;