var test = require('tape');
var proc = require('../');

test("can get active unix sockets",function(t){
  proc.unix(function(err,data){
    if(process.env.DEBUG) console.log(data);
    t.ok(!err,'should not have error '+err);
    t.ok(data[0].Inode,'should have Inode key if parsed correctly') 
    t.end();
  });
})


