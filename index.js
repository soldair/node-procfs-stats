
var fs = require('fs');
var hexip = require('hexip');

// read the procfs stat file for a pid
module.exports = function(pid,cb){ // or task: ":pid/task/:tid"
  var o = {
    pid:pid,
    stat:function(cb){
      fs.readFile("/proc/"+pid+'/stat',function(err,data){
        if(err) return cb(err);
        var values = data.toString().trim().split(" ");
        cb(false,assoc(module.exports.fields['/proc/:pid/stat'],values));
      });
    },
    // memory stat file 
    statm:function(cb){
      fs.readFile('/proc/'+pid+'/statm',function(err,buf){
          if(err) return cb(err);
          var values = buf.toString().trim().split(/\s+/g)
          cb(false,assoc(module.exports.fields['/proc/:pid/statm'],values))
      })
    },
    // status is a human version of most but not all of the data in both stat and statm
    status:function(cb){
      fs.readFile('/proc/'+pid+'/status',function(err,buf){
        cb(err,kv(buf));
      });
    },
    cmdline:function(cb){ 
      fs.readFile('/proc/'+pid+'/cmdline',function(err,buf){
        cb(err,nulldelim(buf));
      });
    },
    env:function(cb){
      fs.readFile('/proc/'+pid+'/environ',function(err,buf){
        cb(err,nulldelim(buf));
      });     
    },
    cwd:function(cb){
      fs.readlink("/proc/"+pid+"/cwd",function(err,path){
        cb(err,path);
      })
    },
    io:function(cb){
      fs.readFile('/proc/'+pid+'/io',function(err,buf){
        if(err) return cb(err);
        cb(false,kv(buf));
      });
    },
    fds:function(cb){
      var fddir = '/proc/'+pid+'/fd';
      fs.readdir(fddir,function(err,fds){
        if(err) return cb(err);
        fds = fds.map(function(v){
          return fddir+'/'+v;
        });
        cb(false,fds);
      })
    },
    threads:function(cb){
      // read the number of threads running out of the tasks dir
      var fddir = '/proc/'+pid+'/task';
      fs.readdir(fddir,function(err,fds){
        if(err) return cb(err);
        fds = fds.map(function(v){
          s = fddir+'/'+v;
          s.id = v;
        });
        cb(false,fds);
      })
    },
    thread:function(tid){
      return  module.exports(pid+"/task/"+tid);
    },
  }

  return o;
};


// stat fd, get full path, get type/socket type..
module.exports.fd = function(fdlink,cb){
  fs.readlink(fdlink,function(err,p){
    if(err) return cb(err);
    var infop = fdlink.split('/');
    var id = infop.pop(); 

    var out = {
      path:p,
      info:false,
      stat:false
    }

    infop = infop.join('/')+'info/'+id;

    var c = 1, done = function(){
      if(!--c) cb(false,out); 
    }

    fs.readFile(infop,function(err,fdinfo){
      if(err) return cb(err);
      out.info = kv(fdinfo);
      done();
    });

    if(p.indexOf('/') === 0) {
      c++;
      fs.stat(p,function(err,stat){
        // ignore enoent probably
        if(err) return cb(err);
        out.stat = stat;
        done();
      })
    }
  });
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

// active tcp
module.exports.tcp = function(cb){
  fs.readFile("/proc/net/tcp",function(err,buf){
    var t = nettable(buf);
    t.forEach(function(con){
      con.rem_address = fixaddr(con.rem_address);
      con.local_address = fixaddr(con.local_address);
    });
    cb(err,t,buf);
  });
}

// active udp
module.exports.udp = function(cb){
  fs.readFile("/proc/net/udp",function(err,buf){
    var t = nettable(buf);
    t.forEach(function(con){
      con.rem_address = fixaddr(con.rem_address);
      con.local_address = fixaddr(con.local_address);
    });
    cb(err,t,buf);
  });
}

// active unix
module.exports.unix = function(cb){
  fs.readFile("/proc/net/unix",function(err,buf){
    var lines = buf.toString().trim().split("\n");
    var keys = lines.shift().trim().split(/\s+/);
    var out = [];
    lines.forEach(function(l){
      out.push(assoc(keys,l.trim().split(/\s+/)))
    });
    cb(err,out,buf);
  });
}

// net dev stats per NIC
module.exports.net = function(cb){
  fs.readFile("/proc/net/dev",function(err,buf){
    cb(err,sectiontable(buf),buf);
  });
}

// wifi stats
module.exports.wifi = function(cb){
  fs.readFile("/proc/net/wireless",function(err,buf){
    cb(err,sectiontable(buf),buf);
  });
}

module.exports.disk = function(cb){
  fs.readFile("/proc/diskstats",function(err,buf){
    if(err) return cb(err);

    var lines = buf.toString().trim().split("\n");
    var out = []
    lines.forEach(function(l){
      out.push(assoc(module.exports.fields['/proc/diskstats'],l.trim().split(/\s+/)))
    })
    cb(false,out,buf);
  });

}


//i wonder if this is useful? you have to be root to get it.
// its not documented and the nr of the syscall though its supposed to be first never gives me the value i expect in the syscall mapping table. 
// i checked unistd.h and a few other places for the __NR nr int value it must be another number not listed.
//module.exports.syscall = function(){
  //http://git.kernel.org/cgit/linux/kernel/git/torvalds/linux.git/diff/fs/proc/base.c?id=ebcb67341fee34061430f3367f2e507e52ee051b
  //+          "%ld 0x%lx 0x%lx 0x%lx 0x%lx 0x%lx 0x%lx 0x%lx 0x%lx\n",
  //+          nr,
  //+          args[0], args[1], args[2], args[3], args[4], args[5],
  //+          sp, pc);
  //
  // 232 0x5 0x7fff89a352b0 0x400 0x3e8 0x44 0x7fff89a382f0 0x7fff89a38220 0x7f042d9a9619
  // 232 0x5 0x7fff89a352b0 0x400 0x7d0 0x2214350 0x7fff89a382f0 0x7fff89a38158 0x7f042d9a9619 
//}

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
      ,'cguest_time'
    ],
    '/proc/:pid/statm':[
      "size"     // total program size
                 // (same as VmSize in /proc/[pid]/status)
      ,"resident"// resident set size
                 // (same as VmRSS in /proc/[pid]/status)
      ,"share"   // shared pages (from shared mappings)
      ,"text"    // text (code)
      ,"lib"     // library (unused in Linux 2.6)
      ,"data"    // data + stack
      ,"dt"      // dirty pages (unused in Linux 2.6)
    ],
    '/proc/diskstats':[
      "device_number","device_number_minor","device"
      ,"reads_completed","reads_merged","sectors_read","ms_reading"
      ,"writes_completed","writes_merged","sectors_written","ms_writing"
      ,"ios_pending","ms_io","ms_weighted_io"
    ]
}


// works on linuxy /proc
module.exports.works = fs.existsSync('/proc/'+process.pid+'/stat');

function assoc(fields,values){
  var o = {};
  var a = 0;
  values.forEach(function(v,i){
    if(fields.length <= i) {
      if(!o._) o._ = {};
      o._[i] = v;
    } else o[fields[i]] = v;
  });
  return o;
}

function kv(buf){
  if(!buf) return false;
  var info = {};
  var lines = buf.toString().split("\n");
  lines.forEach(function(l){
    var matches = l.match(/^([^:]+):[\s]+(.+)$/);
    if(!matches) return;
    info[matches[1]] = matches[2];
  });
  return info;
}


function nettable(data){
  if(!data) return false;
  var lines = data.toString().trim().split("\n");
  var split = /\s+/g;
  var keys = lines.shift().trim().split(split);

  lines = lines.map(function(l){
    var values = l.trim().split(split);
    values.forEach(function(v,i){
      if(keys[i] == 'tx_queue' || keys[i] == "tr") {
        var parts = v.split(":");
        values[i] = parts[0];
        values.splice(i+1,0,parts[1]);
      }
    });
    return assoc(keys,values);
  })
  return lines;
}

function sectiontable(buf){
  if(!buf) return false;
  var lines = buf.toString().trim().split("\n");
  var sections = lines.shift();

  var columns = lines.shift().trim().split('|');
  var sections = sections.split('|');

  var s,l,c,p = 0,map = {},keys = [];
  for(var i=0;i<sections.length;++i) {
    s = sections[i].trim();
    l = sections[i].length; 
    c = columns[i].trim().split(/\s+/g);
    while(c.length) {
      map[keys.length] = s;
      keys.push(c.shift());
    }
    p += s.length+1;
  }

  var data = [];
  lines.forEach(function(l){
    l = l.trim().split(/\s+/g);
    var o = {};
    for(var i=0;i<l.length;++i){
      var s = map[i];
      // Inter-|
      // face  |
      /*
        {
          "Interface":"eth0"
        }
      */
      if(s.indexOf('-') === s.length-1) o[s.substr(s,s.length-1)+keys[i]] = l[i];
      else {
        /*
        {
          bytes:{
            Recieve:43124236,
            Transmit:87782782
          }
        }
        */
        if(!o[keys[i]]) o[keys[i]] = {};
        o[keys[i]][s] = l[i];
      }
    }
    data.push(o)
  });

  return data;
}

function fixaddr(addr){
  addr = addr.split(':');
  return hexip(addr[0])+':'+hexip.port(addr[1]);
}

function nulldelim(buf){
  if(!buf) return false;
  var args = buf.toString().split("\x00")
  args.pop();// remove trailing empty.
  return args; 
}
