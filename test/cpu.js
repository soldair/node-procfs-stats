var test = require('tape');
var proc = require('../');

test('can read cpuinfo',function(t){

  proc.cpu(function(err,data){

    if(process.env.DEBUG) console.log(data);
    t.ok(!err,'should not have error gettijng cou'+err);
    t.ok(data,'should have cpu data');
    t.end();
  })

})

