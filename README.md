procfs-stats
============

get more detailed information (than ps, top etc) about running process and threads on linux machines from node.

### require!
```js
var procfs = require('procfs-stats');
```
the api

<a href="#ctor"></a>
### procfs(pid)
  - returns PidStats ps

<a href="#pidstats-io"></a>
### ps.io(cb)
  - disk io stats
  
<a href="#pidstats-stat"></a>
### ps.stat(cb)
  - mixed detailed process stats
  - calls back with 

<a href="#pidstats-statm"></a>
### ps.statm(cb)
  - memory stats
  - calls back with an object of mem stats

<a href="#pidstats-status"></a>
### ps.status(cb)
  - mixed process stats with more human friendly formatting

<a href="#pidstats-env"></a>
### ps.env(cb)
  - calls back with the array of environment variables as they were defined when the process started.

<a href="#pidstats-cwd"></a>
### ps.cwd(cb)
  - calls back with the working directory of the process when it was started 

<a href="#pidstats-fds"></a>
### ps.fds(cb)
  - returns an array of paths to file descriptors in the procfs fds directory for this process. 

<a href="#pidstats-threads"></a>
### ps.threads(cb)
  - calls back with an array of the paths to each task in the procfs task dir. each string has an id property which can be passed to ps.thread

<a href="#pidstats-thread"></a>
### ps.thread(tid)
  - returns PidStats object for taskid

the default export also has these methods.

<a href="#fd"></a>
### procfs.fd(fdPath,cb)
  - fdPath is the full path 
  - calls back with an object with 
  - fdinfo from /prod/pid/fdinfo/fdnum
  - stat fs.Stats object
  - full path to file. 
  - in the case of a socket a string "socket[inode]" will be returned

<a href="#tcp"></a>
### procfs.tcp(cb)
  - the tcp connection table as an array
  - used to count connections/servers and get throughput per active connection

<a href="#udp"></a>
### procfs.udp(cb)
  - the udp connection table as an array
  - used to count listeners/server and get throughput

<a href="#unix"></a>
### procfs.unix(cb)
  - the unix socket table as an array

<a href="#net"></a>
### procfs.net(cb)
  - calls back with and array of network devices along with transmit recieve

<a href="#disk"></a>
### procfs.disk(cb)
  - calls back with disk stats like ios_pending and throughput

<a href="#wifi"></a>
### procfs.wifi(cb)
  - calls back with wifi defices and stats

<a href="#works"></a>
### procfs.works === true||false
  - if the procfs can be accessed this value is true


