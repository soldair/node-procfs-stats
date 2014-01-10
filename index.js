

var fs = require('fs');

// read the procfs stat file for a pid
module.exports = function(pid,cb){ // or task: ":pid/task/:tid"
  fs.readFile("/proc/"+pid+'/stat',function(err,data){
    if(err) return cb(err);
    var values = data.toString().trim().split(" ");
    cb(false,assoc(module.exports.fields['/proc/:pid/stat'],values));
  });
}
  
// read the number of threads running out of the tasks dir
module.exports.threads = function(pid,cb){
  
}

// read the number of fds in the fd folder
module.exports.fds = function(pid,cb){// or task: ":pid/task/:tid"
  var fddir = '/proc/'+pid+'/fd';
  fs.readdir(fddir,function(err,fds){
    if(err) return cb(err);
    fds = fds.map(function(v){
      return fddir+'/'+v;
    });
    cb(false,fds);
  })
}

// stat fd, get full path, get type/socket type..
module.exports.fd = function(fdlink,cb){
  fs.readlink(fdlink,function(err,p){
    if(err) return cb(err);
    if(p.indexOf('/') !== 0) {
      cb(false,{path:p,stat:false})
      // i can do netstat etc here when i figure it out. =)
    } else {
      fs.stat(p,function(err,stat){
        // ignore enoent probably
        if(err) return cb(err);
        cb(false,{path:p,stat:stat});
      })
    }
  }) 
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

//i wonder if this is useful? you have to be root to get it.
// its not documented and its probably useless.
module.exports.syscall = function(){
  //http://git.kernel.org/cgit/linux/kernel/git/torvalds/linux.git/diff/fs/proc/base.c?id=ebcb67341fee34061430f3367f2e507e52ee051b
  //+          "%ld 0x%lx 0x%lx 0x%lx 0x%lx 0x%lx 0x%lx 0x%lx 0x%lx\n",
  //+          nr,
  //+          args[0], args[1], args[2], args[3], args[4], args[5],
  //+          sp, pc);
  //
  // 232 0x5 0x7fff89a352b0 0x400 0x3e8 0x44 0x7fff89a382f0 0x7fff89a38220 0x7f042d9a9619
  // 232 0x5 0x7fff89a352b0 0x400 0x7d0 0x2214350 0x7fff89a382f0 0x7fff89a38158 0x7f042d9a9619 
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



