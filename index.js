const RepoListQueryCaller = require('./execute/caller/RepoListQueryCaller').RepoListQueryCaller;
//const PopularityIndexQueryType = require('./github/query/types/simpleQueries/PopularityIndexQueryType');
const PaginationContributorQueryType = require('./github/query/types/paginationQueries/PaginationContributorQueryType').PaginationContributorQueryType;

const config = {propertyName: 'repoName', outputDirPath: './result/', separationSize: 100};

console.time('ExecutionTimer');
const endpointPromise = RepoListQueryCaller.call(new PaginationContributorQueryType(), './repoList/repoList.json', config);
endpointPromise.then(console.timeEnd('ExecutionTimer'))
    .catch(err => {console.error(err); console.timeEnd('ExecutionTimer')});