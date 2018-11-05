const GithubConfigProvider = require('./github/endpoint/config/GithubConfigProvider');
const GithubEndpoint = require('./github/endpoint/GithubEndpoint');

const RepositoryDescriptor = require('./github/RepositoryDescriptor');

const RepoQueryGenerator = require('./github/query/RepoQueryGenerator');
const PopularityIndexQueryType = require('./github/query/types/PopularityIndexQueryType');

const config = GithubConfigProvider.readConfig();
const repoList = [new RepositoryDescriptor('facebook', 'react')];
repoList.push(new RepositoryDescriptor('Valor-mmm', 'Payinator'));

const generatedQuery = RepoQueryGenerator.createQuery(new PopularityIndexQueryType(), repoList);

GithubEndpoint.callEndpoint(config, null, generatedQuery).then(res => {console.log(res)}).catch(err => console.error('Error: ' + err));