
var test = require('tape');
var proc = require('../')

test("can read tcp table",function(t){
  proc.tcp(function(err,data){
    if(process.env.DEBUG) console.log(data);
    t.ok(!err,'should not have error getting tcp info '+err);
    t.ok(data[0].local_address,'should have tcp data');
    t.end();
  })
});


