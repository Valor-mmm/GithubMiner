const RepoListQueryExecutor = require('./execute/RepoListQueryExecutor');
const PopularityIndexQueryType = require('./github/query/types/PopularityIndexQueryType');


const config = {propertyName: 'repoName', outputDirPath: './finalResult/', separationSize: 100};

console.time('ExecutionTimer');
const endpointPromise = RepoListQueryExecutor.execute(new PopularityIndexQueryType(), './repoList/FinalRepoNames.json', config);
endpointPromise.then(console.timeEnd('ExecutionTimer'))
    .catch(err => {console.error('Error during execution start. ' + err); console.timeEnd('ExecutionTimer')});