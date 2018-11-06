const RepoListQueryExecutor = require('./execute/RepoListQueryExecutor');
const PopularityIndexQueryType = require('./github/query/types/PopularityIndexQueryType');


const endpointPromise = RepoListQueryExecutor.execute(new PopularityIndexQueryType(), './repoList/1500Refurbished.json', {propertyName: 'repo_name', outputDirPath: './abcd'});
endpointPromise.then(console.log('Started execution.'))
    .catch(err => console.error('Error during execution start. ' + err));