var test = require('tape');
var proc = require('../');

test('can read wifi data',function(t){

  proc.wifi(function(err,data){

    if(process.env.DEBUG) console.log(data);
    t.ok(!err,'should not have error getting wifi data '+err);
    t.ok(data,'should have wifi data');
    t.end();
  })

})

