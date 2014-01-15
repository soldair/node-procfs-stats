var proc = require('../')
, test = require('tape')
;

test('can get proc cwd',function(t){
  var p = proc(process.pid);

  p.cwd(function(err,cwd){
    t.ok(!err,'should not have error getting cwd for this process'+err);
    t.ok(cwd,"should have cwd");

    if(process.env.DEBUG) console.log(cwd);

    t.end();
  });

})
