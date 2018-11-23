const Fragment = require('../Fragment').Fragment;

const target = 'Repository';

class RepoPaginationFragmentGenerator {

    static getContributorsFragment(paginationEnum) {
        if (!paginationEnum || !(typeof paginationEnum === 'object') || !(typeof paginationEnum.toString === 'function')) {
            logger.error('Mandatory parameter paginationEnum is missing or is not a object with toString function.');
            return null;
        }

        const fragmentName = 'contributorsFragment';
        const fragmentContent = `fragment ${fragmentName} on ${target} {
            defaultBranchRef {
  	            target {
                    ... on Commit {
                        history(${paginationEnum.toString()}) {
                            pageInfo {
                                startCursor
                                endCursor
                                hasNextPage
                            }
                            nodes {
                                author {
                                    email
                                    name
                                    user {
                                        name
                                        login
                                    }
                                }
                                committer {
                                  email
                                  name
                                  user {
                                    name
                                    login
                                  }
                                }
                            }
                        }
  	                }
                }
            }
        }`;
        return new Fragment(fragmentName, fragmentContent);
    }

}

exports.RepoPaginationFragmentGenerator = RepoPaginationFragmentGenerator;

const logger = require('../../../LoggerProvider').getLogger(RepoPaginationFragmentGenerator);