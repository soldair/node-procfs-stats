var proc = require('../')
, test = require('tape')
;

test('can get prod info',function(t){
  var p = proc(process.pid);

  p.argv(function(err,data){
    t.ok(!err,'should not have error getting args for this command'+err);
    t.equals(data[0],'node',"should have node as the first arg");

    if(process.env.DEBUG) console.log(data);

    t.end();
  });

})
