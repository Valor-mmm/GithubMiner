const Fragment = require('./Fragment').Fragment;

const target = 'Repository';

class RepoFragmentGenerator {
    
    static getRepoFragment(content) {
        const fragmentName = 'repository';
        if (!content) {
            content = '';
        }

        const fragmentContent =
            `fragment ${fragmentName} on ${target} {
                    nameWithOwner
                    createdAt
                    updatedAt
                    isFork
                    ${content}
            }`;

        return new Fragment(fragmentName, fragmentContent)
    }

    static getGeneralFragment() {
        const fragmentName = 'generalFragment';
        const fragmentcontent = `fragment ${fragmentName} on ${target} {
            nameWithOwner
            description
            diskUsage
        }`;

        return new Fragment(fragmentName, fragmentcontent);
    }

    static getReleasesFragment() {
        const fragmentName = 'releasesFragment';
        const fragmentContent = `fragment ${fragmentName} on ${target} {
            releases(first:0) {
                totalCount
            }
        }`;

        return new Fragment(fragmentName, fragmentContent);
    }

    static getStarsFragment() {
        const fragmentName = 'starsFragment';
        const fragmentContent = `fragment ${fragmentName} on ${target} {
            stargazers(first: 0) {
                totalCount
            }
        }`;

        return new Fragment(fragmentName, fragmentContent);
    }

    static getDefaultBranchCommitsFragment() {
        const fragmentName = 'defaultBranchCommitsFragment';
        const fragmentContent = `fragment ${fragmentName} on ${target} {
            defaultBranchRef {
  	            target {
                    ... on Commit {
                        history(first:0) {
                            totalCount
                        }
                    }
  	            }
            }
        }`;
        return new Fragment(fragmentName, fragmentContent);
    }

    static getForkInfoFragment() {
        const fragmentName = 'forkInfoFragment';
        const fragmentContent = `fragment ${fragmentName} on ${target} {
            isFork
            forkCount
        }`;
        return new Fragment(fragmentName, fragmentContent);
    }

    static getTimeInfoFragment() {
        const fragmentName = 'timeInfoFragment';
        const fragmentContent = `fragment ${fragmentName} on ${target} {
              createdAt
              updatedAt
        }`;

        return new Fragment(fragmentName, fragmentContent);
    }

    static getWatchersCountFragment() {
        const fragmentName = 'watcherCountFragment';
        const fragmentContent = `fragment ${fragmentName} on ${target} {
            watchers {
                totalCount
            }
        }`;

        return new Fragment(fragmentName, fragmentContent);
    }

    static getNameWithOwnerFragment() {
        const fragmentName = 'nameWithOwnerFragment';
        const fragmentContent = `fragment ${fragmentName} on ${target} {
           nameWithOwner 
        }`;

        return new Fragment(fragmentName, fragmentContent);
    }



}

module.exports = RepoFragmentGenerator;