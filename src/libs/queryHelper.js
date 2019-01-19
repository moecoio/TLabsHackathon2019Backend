function parseQueryParams(queryParams) {
  let result = { where: {} };
  if( typeof(queryParams.__offset) != 'undefined' )
    result.offset = queryParams.__offset;

  if( typeof(queryParams.__count) != 'undefined' )
    result.limit = queryParams.__count;

  if( typeof(queryParams.__order) != 'undefined' )
    result.order = [ queryParams.__order.split(' ') ];
  
  return result;
}

module.exports = {
  parseQueryParams: parseQueryParams
}; 
