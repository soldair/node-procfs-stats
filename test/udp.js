
var test = require('tape');
var proc = require('../')

test("can read udp table",function(t){
  proc.udp(function(err,data){
    if(process.env.DEBUG) console.log(data);
    t.ok(!err,'should not have error getting udp info '+err);
    t.ok(data[0].local_address,'should have udp data');
    t.end();
  })
});
