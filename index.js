const RepoListQueryCaller = require('./execute/caller/RepoListQueryCaller').RepoListQueryCaller;
const PopularityIndexQueryType = require('./github/query/types/PopularityIndexQueryType');

const logger = require('./LoggerProvider').getLogger(null);


const config = {propertyName: 'repoName', outputDirPath: './result/', separationSize: 100};

console.time('ExecutionTimer');
const endpointPromise = RepoListQueryCaller.execute(new PopularityIndexQueryType(), './repoList/repoList.json', config);
endpointPromise.then(console.timeEnd('ExecutionTimer'))
    .catch(err => {console.error('Error during execution start. ' + err); console.timeEnd('ExecutionTimer')});