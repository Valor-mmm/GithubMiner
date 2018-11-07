const RepoListQueryExecutor = require('./execute/RepoListQueryExecutor');
const PopularityIndexQueryType = require('./github/query/types/PopularityIndexQueryType');


const config = {propertyName: 'repo_name', outputDirPath: './separation200/', separationSize: 200};
const endpointPromise = RepoListQueryExecutor.execute(new PopularityIndexQueryType(), './repoList/14000Names.json', config);
endpointPromise.then(console.log('Started execution.'))
    .catch(err => console.error('Error during execution start. ' + err));