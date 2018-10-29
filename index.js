const GithubConfigProvider = require('./github/endpoint/config/GithubConfigProvider');
const GithubEndpoint = require('./github/endpoint/GithubEndpoint');


const config = GithubConfigProvider.readConfig();

const query = `query { 
  repository(owner:"Valor-mmm", name:"Ranner-Backend") {
    name
  }
}`;

GithubEndpoint.callEndpoint(config, null, query).then(res => console.log(res)).catch(err => console.error(err));
