const QueryExecutor = require('./QueryExecutor').QueryExecutor;

class PaginationQueryExecutor extends QueryExecutor{


}

exports.PaginationQueryExecutor = PaginationQueryExecutor;

const logger = require('../../LoggerProvider').getLogger(PaginationQueryExecutor);