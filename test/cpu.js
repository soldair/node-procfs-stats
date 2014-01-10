var test = require('tape');
var proc = require('../');

test('can read cpuinfo',function(t){

  proc.cpu(function(err,data){
    console.log(err,data);
    t.ok(!err,'should not have error gettijng cou'+err);
    t.ok(data,'should have cpu data');
    t.end();
  })

})

