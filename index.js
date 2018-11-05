const RepoListQueryExecutor = require('./execute/RepoListQueryExecutor');
const PopularityIndexQueryType = require('./github/query/types/PopularityIndexQueryType');


const endpointPromise = RepoListQueryExecutor.execute(new PopularityIndexQueryType(), './repoList/1500Refurbished.json', {propertyName: 'repo_name'});
endpointPromise.then(res => {console.log(res)}).catch(err => console.error('Error: ' + err));