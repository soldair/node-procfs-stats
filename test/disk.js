var test = require('tape');
var proc = require('../');

test("can get io data for disks",function(t){
  proc.disk(function(err,data){
    if(process.env.DEBUG) console.log(data);
    t.ok(!err,'should not have error '+err);
    t.ok(data[0].ios_pending,'should have ios_pending key if parsed correctly') 
    t.end();
  });
})


