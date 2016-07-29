var once  = require('once')
var fs = require('fs');
var hexip = require('hexip');
var parseaddr = require('./lib/parse-addr')
var nettable = require('./lib/nettable')

// read the procfs stat file for a pid
module.exports = function(pid/*,procpath*/,cb){ // or task: ":pid/task/:tid"

  var pp = _pp(arguments,1);
  var procPath = pp.procPath
  cb = pp.cb;

  var o = {
    pid:pid,
    stat:function(cb){
      fs.readFile(procPath+pid+'/stat',function(err,data){
        if(err) return cb(err);
        var values = data.toString().trim().split(" ");
        cb(false,assoc(module.exports.fields['/proc/:pid/stat'],values));
      });
    },
    // memory stat file
    statm:function(cb){
      fs.readFile(procPath+pid+'/statm',function(err,buf){
          if(err) return cb(err);
          var values = buf.toString().trim().split(/\s+/g)
          cb(false,assoc(module.exports.fields['/proc/:pid/statm'],values))
      })
    },
    // status is a human version of most but not all of the data in both stat and statm
    status:function(cb){
      fs.readFile(procPath+pid+'/status',function(err,buf){
        cb(err,kv(buf));
      });
    },
    argv:function(cb){
      fs.readFile(procPath+pid+'/cmdline',function(err,buf){
        cb(err,nulldelim(buf));
      });
    },
    env:function(cb){
      fs.readFile(procPath+pid+'/environ',function(err,buf){
        cb(err,nulldelim(buf));
      });
    },
    cwd:function(cb){
      fs.readlink(procPath+pid+"/cwd",function(err,path){
        cb(err,path);
      })
    },
    io:function(cb){
      fs.readFile(procPath+pid+'/io',function(err,buf){
        if(err) return cb(err);
        cb(false,kv(buf));
      });
    },
    fds:function(cb){
      var fddir = procPath+pid+'/fd';
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
      var fddir = procPath+pid+'/task';
      fs.readdir(fddir,function(err,fds){
        if(err) return cb(err);
        //fds = fds.map(function(v){
          //return {id:v,path:ddir+'/'+v};
        //});
        cb(false,fds);
      })
    },
    thread:function(tid){
      return  module.exports(pid+"/task/"+tid);
    },
    net:function(cb){
      cb = once(cb)
      var c = 2
      
      var tcp;
      var fds;
      

      module.exports.tcp(procPath,function(err,data){
        if(err) return cb(err)

        tcp = data
        next()
      })

      this.fds(function(err,data){

        if(err) return cb(err)

        var fds = {}
        var todo = data.length;
        if(!todo) return next()

        function work(){
          if(!data.length) return;
          var fd = data.shift()
          fs.readlink(fd,function(err,path){
            // the fd may not exist anymore.
            if(err) return next();

            fds[fd] = path;
            if(!--todo) next() 
          })
        }

        var conc = 10
        while(conc-- > 0) work() 

      })

      function next(){
        if(--c) return work()

        // find socket fds in tcp nettable

        console.log(nettable)
        console.log(fds)

      }
    }
  }

  return o;
};


// path to /proc
module.exports.PROC = '/proc/';


// stat fd, get full path, get type/socket type..
module.exports.fd = function(fdlink,cb){

  fs.readlink(fdlink,function(err,p){
    if(err) return cb(err);
    var infop = fdlink.split('/');
    var id = infop.pop();

    var out = {
      fd:fdlink,
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

  var pp = _pp(arguments);
  var procPath = pp.procPath
  cb = pp.cb;

  fs.readFile(procPath+'stat',function(err,buf){
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

module.exports.meminfo = function (cb){

  var pp = _pp(arguments);
  var procPath = pp.procPath
  cb = pp.cb;

  fs.readFile(procPath+'meminfo',function(err,buf){
    if(err) return cb(err);
    var lines = buf.toString().trim().split("\n");

    var o = {};
    lines.forEach(function(l){
      var p = l.indexOf(':');
      var k = l.substr(0,p);
      var v = l.substr(p + 1).replace(/kB/,'').trim();

      o[k] = v;
    })

    cb(false,o);

  });
}

// active tcp
module.exports.tcp = function(cb){
  var pp = _pp(arguments);
  var procPath = pp.procPath
  cb = pp.cb;

  fs.readFile(procPath+"net/tcp",function(err,buf){
    if(err) return cb(err);
    var t = nettable(buf);
    t.forEach(function(con){
      con.rem_address = parseaddr(con.rem_address);
      con.local_address = parseaddr(con.local_address);
    });
    cb(null,t,buf);
  });
}

// active udp
module.exports.udp = function(cb){
  var pp = _pp(arguments);
  var procPath = pp.procPath
  cb = pp.cb;


  fs.readFile(procPath+"net/udp",function(err,buf){
    if(err) return cb(err);
    var t = nettable(buf);
    t.forEach(function(con){
      con.rem_address = parseaddr(con.rem_address);
      con.local_address = parseaddr(con.local_address);
    });
    cb(null,t,buf);
  });
}

// active unix
module.exports.unix = function(cb){
  var pp = _pp(arguments);
  var procPath = pp.procPath
  cb = pp.cb;

  fs.readFile(procPath+"net/unix",function(err,buf){
    if(err) return cb(err);
    var lines = buf.toString().trim().split("\n");
    var keys = lines.shift().trim().split(/\s+/);
    var out = [];
    lines.forEach(function(l){
      out.push(assoc(keys,l.trim().split(/\s+/)))
    });
    cb(null,out,buf);
  });
}

// net dev stats per NIC
module.exports.net = function(cb){
  var pp = _pp(arguments);
  var procPath = pp.procPath
  cb = pp.cb;

  fs.readFile(procPath+"net/dev",function(err,buf){
    if(err) return cb(err);
    cb(err,sectiontable(buf),buf);
  });
}

// wifi stats
module.exports.wifi = function(cb){
  var pp = _pp(arguments);
  var procPath = pp.procPath
  cb = pp.cb;

  fs.readFile(procPath+"net/wireless",function(err,buf){
    if(err) return cb(err);
    cb(null,sectiontable(buf),buf);
  });
}

module.exports.disk = function(cb){
  var pp = _pp(arguments);
  var procPath = pp.procPath
  cb = pp.cb;


  fs.readFile(procPath+"diskstats",function(err,buf){
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

function nulldelim(buf){
  if(!buf) return false;
  var args = buf.toString().split("\x00")
  args.pop();// remove trailing empty.
  return args;
}

function _pp(a,num){
  num = num||0;// number of static args.
  // custom proc path is always before the cb.
  var args = [].slice.call(a);

// pop off callback
  var cb = args.pop();

  // shift off preceding args.
  for(var i=0;i<num;++i) args.shift();

  //i only ever need procpath.
  var procPath = args.shift()||module.exports.PROC||'/proc/';
  // add missing / if needed.
  if(procPath.charAt(procPath.length-1) != '/') procPath += '/';

  return {procPath:procPath,cb:cb};
}
