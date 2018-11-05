const RepoQueryExecutor = require('./execute/RepoQueryExecutor');

const RepositoryDescriptor = require('./github/RepositoryDescriptor');

const PopularityIndexQueryType = require('./github/query/types/PopularityIndexQueryType');

const repoList = [new RepositoryDescriptor('facebook', 'react')];
repoList.push(new RepositoryDescriptor('Valor-mmm', 'Payinator'));

const endpointPromise = RepoQueryExecutor.execute(new PopularityIndexQueryType(),repoList, null);
endpointPromise.then(res => {console.log(res)}).catch(err => console.error('Error: ' + err));