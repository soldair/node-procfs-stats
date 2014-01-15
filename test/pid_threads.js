var proc = require('../')
, test = require('tape')
;

test('can get proc threads',function(t){
  var p = proc(process.pid);

  p.threads(function(err,threads){
    t.ok(!err,'should not have error getting cwd for this process'+err);
    t.ok(threads.length,"should have threads");

    if(process.env.DEBUG) console.log(threads);

    t.end();
  });

})
