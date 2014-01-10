var test = require('tape');
var proc = require('../');

test('can read cpuinfo',function(t){

  proc.io(process.pid,function(err,data){
    console.log(err,data);
    t.ok(!err,'should not have error gettijng pid io'+err);
    t.ok(data,'should have io data');
    t.end();
  })

})

