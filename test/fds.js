var proc = require('../')
, test = require('tape')
;

test('can get process fds',function(t){
  proc.fds(process.pid,function(err,data){
    t.ok(!err,'should not have error getting data for this pid '+err);
    t.ok(data.length,"should have data");

    if(!data.length) return t.end();

    var c = 0,done = function(){
      c--;
      if(!c) t.end();
    };

    while(data.length) {
      c++;
      proc.fd(data.shift(),function(err,info){
        console.log(err,info)
        done();
      });
    }
  })
})
