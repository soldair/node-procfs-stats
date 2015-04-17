var test = require('tape');
var stats = require('../');
test("can provide custom proc path",function(t){
  t.plan(1);
  stats.disk('/fake'+Date.now(),function(err,data){
    t.equals(err.code,'ENOENT','should have error getting with fake path');
  })

});


