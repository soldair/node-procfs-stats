var test = require('tape');
var proc = require('../');

test("can get io data for nics",function(t){
  proc.net(function(err,data){
    console.log(data);
    t.ok(!err,'should not have error '+err);
    t.ok(data[0].Interface,'should have interface key if parsed correctly') 
    t.end();
  });
})


