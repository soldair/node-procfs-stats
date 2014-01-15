var proc = require('../')
, test = require('tape')
;

test('can get proc mem stat',function(t){
  var p = proc(process.pid);

  p.statm(function(err,data){
    t.ok(!err,'should not have error getting data for this pid '+err);
    t.ok(data,"should have data");

    if(process.env.DEBUG) console.log(data);

    t.end();
  });

})
