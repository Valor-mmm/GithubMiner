const RepoListQueryCaller = require('./execute/caller/RepoListQueryCaller').RepoListQueryCaller;
//const PopularityIndexQueryType = require('./github/query/types/simpleQueries/PopularityIndexQueryType');
const PaginationContributorQueryType = require('./github/query/types/paginationQueries/PaginationContributorQueryType').PaginationContributorQueryType;
const logger = require('./LoggerProvider').getLogger('Index');

const config = {propertyName: 'repoName', outputDirPath: './result/', separationSize: 20};

const endpointPromise = RepoListQueryCaller.call(new PaginationContributorQueryType(), './repoList/repoList.json', config);
endpointPromise.then(() => logger.info('Finished initialization.'))
    .catch(err => logger.error('Error during execution: ', err));
