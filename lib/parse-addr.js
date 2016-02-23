var lru = require('lru-cache')
var hexip = require('hexip')

module.exports = parseaddr

var cache = module.exports.cache = lru({
  max:50000,
  maxAge:1000*60*10
})


function parseaddr(addr){
  addr = addr.split(':');
  var ip = cache.get(addr[0])
  if(!ip){
    ip = hexip(addr[0])
    cache.set(addr[0],ip)
  }
  var port = cache.get(addr[1])
  if(!port){
    port = hexip.port(addr[1])
    cache.set(addr[1],port)
  }
  return ip+':'+port;
}


setInterval(function(){
  module.exports.cache.prune()
},1000*60*2).unref()

