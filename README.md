procfs-stats
=================

get more detailed information (than ps, top etc) about running process and threads on linux machines from node.

- require!
```js
var procfs = require('procfs-stats');
```

- procfs(pid)
  returns PidSats

- PidStats ps
  - ps.io(cb)
    - disk io stats
    - 
  - ps.stat(cb)
    - mixed detailed process stats
    - calls back with 
  - ps.statm(cb)
    - memory stats
    - calls back with an object of mem stats
  - ps.status(cb)
    - mixed process stats with more human friendly formatting
  - ps.env(cb)
    - calls back with the array of environment variables as they were defined when the process started.
  - ps.cwd(cb)
    - calls back with the working directory of the process when it was started 
  - ps.fds(cb)
    - returns an array of paths to file descriptors in the procfs fds directory for this process. 
  - ps.threads(cb)
    - calls back with an array of the paths to each task in the procfs task dir. each string has an id property which can be passed to ps.thread
  - ps.thread(tid)
    returns PidStats object for taskid

- procfs.fd(fdPath,cb)
  - fdPath is the full path 
  - calls back with an object with 
  - fdinfo from /prod/pid/fdinfo/fdnum
  - stat fs.Stats object
  - full path to file. 
  - in the case of a socket a string "socket[inode]" will be returned

- procfs.tcp(cb)
  - the tcp connection table as an array
  - used to count connections/servers and get throughput per active connection
- procfs.udp(cb)
  - the udp connection table as an array
  - used to count listeners/server and get throughput
- procfs.unix(cb)
  - the unix socket table as an array
- procfs.net(cb)
  - calls back with and array of network devices along with transmit recieve
- procfs.disk(cb)
  - calls back with disk stats like ios_pending and throughput
- procfs.wifi(cb)
  - calls back with wifi defices and stats
- procfs.works === true||false
  - if the procfs can be accessed this value is true
