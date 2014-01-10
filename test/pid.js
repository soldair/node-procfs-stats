var proc = require('../')
, test = require('tape')
;

test('can get prod info',function(t){
  proc(process.pid,function(err,data){
    t.ok(!err,'should not have error getting data for this pid '+err);
    t.ok(data,"should have data");

    console.log(data);

    t.end();
  })
})
