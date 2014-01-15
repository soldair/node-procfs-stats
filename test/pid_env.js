var proc = require('../')
, test = require('tape')
;

test('can get proc env vars',function(t){
  var p = proc(process.pid);

  p.env(function(err,vars){
    t.ok(!err,'should not have error getting args for this command'+err);
    t.ok(vars.length,"should have vars");

    if(process.env.DEBUG) console.log(vars);

    t.end();
  });

})
