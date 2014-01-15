procfs-stats
============

get more detailed information (than ps, top etc) about running process and threads on linux machines from node.

this only works on linux right now i expect. some things may work on other systems that have some support for procfs.

## hope

it would be so cool to have a higher level module that unifies system monitoring scripts in such a way as each os specific implementation can export a common interface like this and we can have xplatform monitoring helpers!! does windows have any external process introspection api?!

### require!
```js
var procfs = require('procfs-stats');
```
## API

<a href="#ctor"></a>
<a href="#pidstats-io"></a>
<a href="#pidstats-stat"></a>
<a href="#pidstats-statm"></a>
<a href="#pidstats-status"></a>
<a href="#pidstats-env"></a>
<a href="#pidstats-cwd"></a>
<a href="#pidstats-fds"></a>
<a href="#pidstats-threads"></a>
<a href="#pidstats-thread"></a>
<a href="#cpu"></a>
<a href="#fd"></a>
<a href="#tcp"></a>
<a href="#udp"></a>
<a href="#unix"></a>
<a href="#net"></a>
<a href="#disk"></a>
<a href="#wifi"></a>
<a href="#works"></a>


<a name="ctor"></a>
### procfs(pid)
  - returns PidStats ps
  - PidStats is an object with methods documented blelow with the prefix "ps."

```js

var ps = procfs(process.pid)
console.log(ps);


```

<a name="pidstats-io"></a>
### ps.io(cb)
  - from /proc/pid/io
  - disk io stats

```js

 { rchar: '84167',
  wchar: '15978',
  syscr: '107',
  syscw: '47',
  read_bytes: '0',
  write_bytes: '12288',
  cancelled_write_bytes: '0' }

```
 
<a name="pidstats-stat"></a>
### ps.stat(cb)
  - mixed detailed process stats
  - calls back with 



<a name="pidstats-statm"></a>
### ps.statm(cb)
  - memory stats
  - calls back with an object of mem stats

<a name="pidstats-status"></a>
### ps.status(cb)
  - mixed process stats with more human friendly formatting

<a name="pidstats-env"></a>
### ps.env(cb)
  - calls back with the array of environment variables as they were defined when the process started.

<a name="pidstats-cwd"></a>
### ps.cwd(cb)
  - from /proc/pid/cwd
  - calls back with the working directory of the process when it was started 

```js

"/home/soldair/opensource/node-procfs-stats"

```

### ps.argv(cb)
  - from /proc/pid/cmdline
  - calls back with an array of command line arguments used to run the target process

these are the args for the command ```node test/pid_argv.js --example```

```js
[ 'node',
  'test/pid_argv.js',
  '--example' ]
```

<a name="pidstats-fds"></a>
### ps.fds(cb)
  - returns an array of paths to file descriptors in the procfs fds directory for this process. 

```js

[ '/proc/8157/fd/0',
  '/proc/8157/fd/1',
  '/proc/8157/fd/10',
  '/proc/8157/fd/2',
  '/proc/8157/fd/3',
  '/proc/8157/fd/4',
  '/proc/8157/fd/5',
  '/proc/8157/fd/6',
  '/proc/8157/fd/7',
  '/proc/8157/fd/8',
  '/proc/8157/fd/9' ]

```

<a name="pidstats-threads"></a>
### ps.threads(cb)
  - calls back with an array of the paths to each task in the procfs task dir. each string has an id property which can be passed to ps.thread

<a name="pidstats-thread"></a>
### ps.thread(tid)
  - returns PidStats object for taskid

the exported function also has these "static" methods.

<a name="cpu"></a>
### procfs.cpu(cb)

  - uses /proc/stat
  - calls back with an object like this

```js

{ cpu: 
   { user: '22865094',
     nice: '8419',
     system: '41080741',
     idle: '120838211',
     iowait: '31250',
     irq: '13',
     softirq: '38550',
     steal: '0',
     guest: '0',
     guest_nice: '0' },
  cpu0: 
   { user: '5417204',
     nice: '1535',
     system: '8517931',
     idle: '32167970',
     iowait: '13554',
     irq: '10',
     softirq: '33485',
     steal: '0',
     guest: '0',
     guest_nice: '0' },
  ... more cpus
  intr: '779069953 10 0 0 ... so many zeros ... 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0',
  ctxt: '1272813489',
  btime: '1389119192',
  processes: '104169',
  procs_running: '2',
  procs_blocked: '0',
  softirq: '387055666 39 219612430 63769 2305517 2468782 39 16208198 61170901 82217 85143774' }

```

<a name="fd"></a>
### procfs.fd(fdPath,cb)
  - fdPath is the full path 
  - calls back with an object 
  - stat is an fs.Stats object
  - full path to file. 
  - in the case of a socket a string "socket[inode]" or some such will be returned. you can lookup the inode in the net.tcp||udp||unix table for even more info!

```js

{ fd: '/proc/8306/fd/2',
  path: '/dev/pts/6',
  info: { pos: '0', flags: '02100002' },
  stat: 
   { dev: 11,
     mode: 8576,
     nlink: 1,
     uid: 1000,
     gid: 5,
     rdev: 34822,
     blksize: 1024,
     ino: 9,
     size: 0,
     blocks: 0,
     atime: Tue Jan 14 2014 17:19:04 GMT-0800 (PST),
     mtime: Tue Jan 14 2014 17:19:04 GMT-0800 (PST),
     ctime: Thu Jan 09 2014 14:28:29 GMT-0800 (PST) }

// if its not a regular file path supported by stat stat is false.

{ path: 'pipe:[19705393]',
  info: { pos: '0', flags: '02000000' },
  stat: false }

{ path: 'anon_inode:[eventfd]',
  info: { pos: '0', flags: '02004002' },
  stat: false }

```

<a name="tcp"></a>
### procfs.tcp(cb)
  - the tcp connection table as an array
  - used to count connections/servers and get throughput per active connection

<a name="udp"></a>
### procfs.udp(cb)
  - the udp connection table as an array
  - used to count listeners/server and get throughput

<a name="unix"></a>
### procfs.unix(cb)
  - the unix socket table as an array

<a name="net"></a>
### procfs.net(cb)
  - from /proc/net/dev
  - calls back with and array of all network devices along with stats

```js

  [{ Interface: 'wlan0:',
    bytes: { Receive: '301155854', Transmit: '75294312' },
    packets: { Receive: '910966', Transmit: '372927' },
    errs: { Receive: '0', Transmit: '0' },
    drop: { Receive: '0', Transmit: '0' },
    fifo: { Receive: '0', Transmit: '0' },
    frame: { Receive: '0' },
    compressed: { Receive: '0', Transmit: '0' },
    multicast: { Receive: '0' },
    colls: { Transmit: '0' },
    carrier: { Transmit: '0' } },
  { Interface: 'eth0:',
    bytes: { Receive: '1202562365', Transmit: '111732378' },
    packets: { Receive: '1868620', Transmit: '608933' },
    errs: { Receive: '0', Transmit: '0' },
    drop: { Receive: '0', Transmit: '0' },
    fifo: { Receive: '0', Transmit: '0' },
    frame: { Receive: '0' },
    compressed: { Receive: '0', Transmit: '0' },
    multicast: { Receive: '102222' },
    colls: { Transmit: '0' },
    carrier: { Transmit: '0' } }]

```

<a name="disk"></a>
### procfs.disk(cb)
  - uses /proc/diskstats
  - calls back with an array of objects like this.

```js

[ { device_number: '1',
    device_number_minor: '5',
    device: 'ram5',
    reads_completed: '0',
    reads_merged: '0',
    sectors_read: '0',
    ms_reading: '0',
    writes_completed: '0',
    writes_merged: '0',
    sectors_written: '0',
    ms_writing: '0',
    ios_pending: '0',
    ms_io: '0',
    ms_weighted_io: '0' },
  ... many disks or disk like things...
  { device_number: '8',
    device_number_minor: '0',
    device: 'sda',
    reads_completed: '255428',
    reads_merged: '208748',
    sectors_read: '9462489',
    ms_reading: '368008',
    writes_completed: '1604578',
    writes_merged: '735675',
    sectors_written: '36575515',
    ms_writing: '1680932',
    ios_pending: '0',
    ms_io: '410844',
    ms_weighted_io: '2101936' } ]

```

<a name="wifi"></a>
### procfs.wifi(cb)
  - calls back with wifi defices and stats

<a name="works"></a>
### procfs.works === true||false
  - if the procfs can be accessed this value is true


