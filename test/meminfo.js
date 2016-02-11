var test = require('tape');
var proc = require('../');

test('can read meminfo',function(t){

  proc.meminfo(function(err,data){

    if(process.env.DEBUG) console.log(data);
    t.ok(!err,'should not have error gettinng meminfo'+err);
    t.ok(data,'should have meminfo data');
    t.end();
  })

})

