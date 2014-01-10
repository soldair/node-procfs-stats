

var fs = require('fs');

module.exports = function(pid){

}

module.exports.cpu = function(cb){
  fs.readFile('/proc/stat',function(err,buf){
    if(err) return cb(err);
    var lines = buf.toString().trim().split("\n");

    var o = {};
    lines.forEach(function(l){
      var p = l.indexOf(' ');
      var k = l.substr(0,p);
      var v = l.substr(p).trim();

      o[k] = v;
      if(k.indexOf('cpu') === 0) {
        o[k] = assoc(module.exports.fields['/proc/stat'].cpu,v.split(' '));
      }
    })

    cb(false,o);

  });
}

module.exports.fields = {
  '/proc/stat':{
    cpu:['user','nice','system','idle','iowait','irq','softirq','steal','guest','guest_nice']
  },
  '/proc/:pid/stat':[
      'pid','comm','state','ppid','pgrp','session','tty_nr','tpgid','flags'
      ,'minflt','cminflt','majflt','cmajflt','utime','stime','cutime','cstime'
      ,'priority','nice','num_threads','itrealvalue','starttime','vsize','rss'
      ,'rsslim','startcode','endcode','startstack','kstkesp','kstkeip','signal'
      ,'blocked','sigignore','sigcatch','wchan','nswap','cnswap','exit_signal'
      ,'processor','rt_priority','policy','delayacct_blkio_ticks','guest_time'
      ,'cguest_time']
}

// works on linuxy /proc
module.exports.works = fs.existsSync('/proc/'+process.pid+'/stat');

function assoc(fields,values){
  var o = {};
  values.forEach(function(v,i){
    o[fields[i]] = v;
  });
  return o;
}



