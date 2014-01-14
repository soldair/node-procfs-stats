var test = require('tape');
var proc = require('../');

test('can read cpuinfo',function(t){

  var p = proc(process.pid);

  p.io(function(err,data){
    if(process.env.DEBUG) console.log(data);
    t.ok(!err,'should not have error gettijng pid io'+err);
    t.ok(data,'should have io data');
    t.end();
  })

})

