
// faster nettable parser

module.exports = nettable

function nettable(data){
  if(!data) return false;
  var lines = data.toString().trim().split("\n");
  var split = /\s+/g;
  var keys = lines.shift().trim().split(split);

  var values = []
  var r = {}
  var v = ''
  var pos = 0

  var out = []

  for(var i=0;i<lines.length;++i){
    values = lines[i].trim().split(split);
    r = {}
    for(var j=0;j<values.length;++j){
      v = values[j]
      // these 2 fields are delimited by ":"
      if(keys[j] == 'tx_queue' || keys[j] == "tr") {
        var pos = v.indexOf(':')
        r[keys[j]] = v.slice(0,pos)
        v = v.slice(pos+1)
        j++
      }

      if(keys.length <= j) {
        if(!r._) r._ = []
        r._.push(v)
      } else {
        r[keys[j]] = v
      }
    }

    out.push(r)
  }

  return out
}
