procfs-stats
============

get detailed information about running process and threads on linux machines from node. more than ps/top/iostat alone

```js

var procfs = require('procfs-stats');
var ps = procfs(process.pid);

ps.io(function(err,io){

  console.log('my process has done this much io',io);

})

```

this only works on linux right now i expect. some things may work on other systems that have some support for procfs.

## hope

it would be so cool to have a higher level module that unifies system monitoring scripts in such a way as each os specific implementation can export a common interface like this and we can have xplatform monitoring helpers!! does windows have any external process introspection api?!

## API

 * <a href="#ctor">procfs(pid)</a>
 * <a href="#pidstats-io">ps.io(cb)</a>
 * <a href="#pidstats-stat">ps.stat(cb)</a>
 * <a href="#pidstats-statm">ps.statm(cb)</a>
 * <a href="#pidstats-status">ps.status(cb)</a>
 * <a href="#pidstats-env">ps.env(cb)</a>
 * <a href="#pidstats-cwd">ps.cwd(cb)</a>
 * <a href="#pidstats-cwd">ps.argv(cb)</a>
 * <a href="#pidstats-fds">ps.fds(cb)</a>
 * <a href="#pidstats-threads">ps.threads(cb)</a>
 * <a href="#pidstats-thread">ps.thread(tid)</a>
 * <a href="#cpu">procfs.cpu(cb)</a>
 * <a href="#meminfo">procfs.meminfo(cb)</a>
 * <a href="#fd">procfs.fd(cb)</a>
 * <a href="#tcp">procfs.tcp(cb)</a>
 * <a href="#udp">procfs.udp(cb)</a>
 * <a href="#unix">procfs.unix(cb)</a>
 * <a href="#net">procfs.net(cb)</a>
 * <a href="#disk">procfs.disk(cb)</a>
 * <a href="#wifi">procfs.wifi(cb)</a>
 * <a href="#works">procfs.works()</a>


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
  - from /proc/pid/stat
  - mixed detailed process stats
  - calls back with

```js

{ pid: '8157',
  comm: '(node)',
  state: 'R',
  ppid: '8156',
  pgrp: '8150',
  session: '1703',
  tty_nr: '34822',
  tpgid: '8150',
  flags: '4202496',
  minflt: '3788',
  cminflt: '0',
  majflt: '0',
  cmajflt: '0',
  utime: '8',
  stime: '1',
  cutime: '0',
  cstime: '0',
  priority: '20',
  nice: '0',
  num_threads: '6',
  itrealvalue: '0',
  starttime: '62912348',
  vsize: '910020608',
  rss: '3277',
  rsslim: '18446744073709551615',
  startcode: '4194304',
  endcode: '12964340',
  startstack: '140736757717536',
  kstkesp: '140736757701400',
  kstkeip: '140541704641018',
  signal: '0',
  blocked: '0',
  sigignore: '4096',
  sigcatch: '16898',
  wchan: '18446744073709551615',
  nswap: '0',
  cnswap: '0',
  exit_signal: '17',
  processor: '0',
  rt_priority: '0',
  policy: '0',
  delayacct_blkio_ticks: '0',
  guest_time: '0',
  cguest_time: '0' }

```

<a name="pidstats-statm"></a>
### ps.statm(cb)
  - from /proc/pid/statm
  - memory stats
  - calls back with an object of mem stats

```js

{ size: '222173',
  resident: '3342',
  share: '1284',
  text: '2142',
  lib: '0',
  data: '215399',
  dt: '0' }

```

<a name="pidstats-status"></a>
### ps.status(cb)
  - from /proc/pid/status
  - mixed process stats with more human friendly formatting

```js

{ Name: 'node',
  State: 'S (sleeping)',
  Tgid: '8157',
  Pid: '8157',
  PPid: '8156',
  TracerPid: '0',
  Uid: '1000\t1000\t1000\t1000',
  Gid: '1000\t1000\t1000\t1000',
  FDSize: '64',
  Groups: '4 20 24 27 30 46 109 121 1000 ',
  VmPeak: '954740 kB',
  VmSize: '888692 kB',
  VmLck: '0 kB',
  VmPin: '0 kB',
  VmHWM: '13464 kB',
  VmRSS: '13368 kB',
  VmData: '861452 kB',
  VmStk: '144 kB',
  VmExe: '8568 kB',
  VmLib: '4084 kB',
  VmPTE: '172 kB',
  VmSwap: '0 kB',
  Threads: '6',
  SigQ: '2/63628',
  SigPnd: '0000000000000000',
  ShdPnd: '0000000000000000',
  SigBlk: '0000000000000000',
  SigIgn: '0000000000001000',
  SigCgt: '0000000180004202',
  CapInh: '0000000000000000',
  CapPrm: '0000000000000000',
  CapEff: '0000000000000000',
  CapBnd: 'ffffffffffffffff',
  Cpus_allowed: 'ff',
  Cpus_allowed_list: '0-7',
  Mems_allowed: '00000000,00000001',
  Mems_allowed_list: '0',
  voluntary_ctxt_switches: '39',
  nonvoluntary_ctxt_switches: '29' }

```

<a name="pidstats-env"></a>
### ps.env(cb)
  - from /proc/pid/environ
  - calls back with the array of environment variables as they were defined when the process started.

```js

[ ...
  'MANPATH=:/usr/local/avr/man:/usr/local/avr/man',
  'LS_OPTIONS=--color=auto',
  'npm_config_git=git',
  'npm_config_optional=true',
  'EDITOR=vim',
  'npm_config_email=soldair@',
  'npm_config_json=' ]

```

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
  - from /proc/pid/fds
  - returns an array of paths to file descriptors in the procfs fds directory for this process.

```js

[ '/proc/8157/fd/0',
  '/proc/8157/fd/1',
  '/proc/8157/fd/10',
  '/proc/8157/fd/2',
  '/proc/8157/fd/9' ]

```

<a name="pidstats-threads"></a>
### ps.threads(cb)
  - from /proc/pid/tasks
  - calls back with an array of the ids/names of each task in the procfs task dir for that pid.

```js

[ '10299', '10300', '10301', '10302', '10303', '10304' ]

```

<a name="pidstats-thread"></a>
### ps.thread(tid)
  - returns PidStats object for taskid

the exported function also has these "static" methods.

```js

var thread = ps.thread(tid);

```

<a name="cpu"></a>
### procfs.cpu(cb)
  - from /proc/stat
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

<a name="meminfo"></a>
### procfs.meminfo(cb)
  - from /proc/meminfo
  - calls back with an object like this

```js

{ MemTotal: '1019452',
  MemFree: '44328',
  MemAvailable: '438588',
  Buffers: '110444',
  Cached: '233468',
  SwapCached: '0',
  Active: '745748',
  Inactive: '136524',
  'Active(anon)': '538432',
  'Inactive(anon)': '64',
  'Active(file)': '207316',
  'Inactive(file)': '136460',
  Unevictable: '0',
  Mlocked: '0',
  SwapTotal: '0',
  SwapFree: '0',
  Dirty: '25788',
  Writeback: '0',
  AnonPages: '538432',
  Mapped: '76296',
  Shmem: '136',
  Slab: '75952',
  SReclaimable: '65052',
  SUnreclaim: '10900',
  KernelStack: '2880',
  PageTables: '5264',
  NFS_Unstable: '0',
  Bounce: '0',
  WritebackTmp: '0',
  CommitLimit: '509724',
  Committed_AS: '1070328',
  VmallocTotal: '34359738367',
  VmallocUsed: '2528',
  VmallocChunk: '34359729003',
  AnonHugePages: '0',
  HugePages_Total: '0',
  HugePages_Free: '0',
  HugePages_Rsvd: '0',
  HugePages_Surp: '0',
  Hugepagesize: '2048',
  DirectMap4k: '22528',
  DirectMap2M: '1026048' }

```

<a name="fd"></a>
### procfs.fd(fdPath,cb)
  - from /proc/pid/fds/fd and /proc/pid/fdinfo
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
  - from /proc/net/tcp
  - the tcp connection table as an array
  - used to count connections/servers and get throughput per active connection
  - note "extra" fields that appear after inode in the text file for tcp connections are placed under the _ key which is an object keyed off of the field offset of the value

```js
[ ....
  { sl: '10:',
    local_address: '127.0.0.1:24599',
    rem_address: '0.0.0.0:0',
    st: '0A',
    tx_queue: '00000000',
    rx_queue: '00000000',
    tr: '00',
    'tm->when': '00000000',
    retrnsmt: '00000000',
    uid: '118',
    timeout: '0',
    inode: '12881',
    _:
     { '12': '1',
       '13': '0000000000000000',
       '14': '100',
       '15': '0',
       '16': '0',
       '17': '10',
       '18': '-1' } } ]

```

<a name="udp"></a>
### procfs.udp(cb)
  - from /proc/net/udp
  - the udp connection table as an array
  - used to count listeners/server and get throughput

```js

[ { sl: '1186:',
    local_address: '127.0.0.1:52011',
    rem_address: '0.0.0.0:0',
    st: '07',
    tx_queue: '00000000',
    rx_queue: '00000000',
    tr: '00',
    'tm->when': '00000000',
    retrnsmt: '00000000',
    uid: '116',
    timeout: '0',
    inode: '12576',
    ref: '2',
    pointer: '0000000000000000',
    drops: '0' },
    ... ]

```

<a name="unix"></a>
### procfs.unix(cb)
  - from /proc/net/unix
  - the unix socket table as an array

```js
[ { Num: '0000000000000000:',
    RefCount: '00000002',
    Protocol: '00000000',
    Flags: '00010000',
    Type: '0001',
    St: '01',
    Inode: '12597',
    Path: '/var/run/mysqld/mysqld.sock' },
  ...]
```

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
  - from /proc/diskstats
  - call back format: cb(false, data, buf), where data looks like below

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
  - from /proc/net/wireless
  - calls back with wifi defices and stats

```js
[ { Interface: 'wlan0:',
    status: '0000',
    link: { Quality: '51.' },
    level: { Quality: '-59.' },
    noise: { Quality: '-256' },
    nwid: { 'Discarded packets': '0' },
    crypt: { 'Discarded packets': '0' },
    frag: { 'Discarded packets': '0' },
    retry: { 'Discarded packets': '40' },
    misc: { 'Discarded packets': '54' },
    beacon: { Missed: '0' } } ]
```


<a name="works"></a>
### procfs.works === true||false
  - fs.exists on /proc
  - if the procfs can be accessed this value is true

```js

if(!procfs.works) process.exit('oh no!')

```
