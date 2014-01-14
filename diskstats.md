/proc/diskstats

https://www.kernel.org/doc/Documentation/iostats.txt

Each set of stats only applies to the indicated device; if you want
system-wide stats you'll have to find all the devices and sum them all up.

Field  1 -- # of reads completed
    This is the total number of reads completed successfully.
Field  2 -- # of reads merged, field 6 -- # of writes merged
    Reads and writes which are adjacent to each other may be merged for
    efficiency.  Thus two 4K reads may become one 8K read before it is
    ultimately handed to the disk, and so it will be counted (and queued)
    as only one I/O.  This field lets you know how often this was done.
Field  3 -- # of sectors read
    This is the total number of sectors read successfully.
Field  4 -- # of milliseconds spent reading
    This is the total number of milliseconds spent by all reads (as
    measured from __make_request() to end_that_request_last()).
Field  5 -- # of writes completed
    This is the total number of writes completed successfully.
Field  6 -- # of writes merged
    See the description of field 2.
Field  7 -- # of sectors written
    This is the total number of sectors written successfully.
Field  8 -- # of milliseconds spent writing
    This is the total number of milliseconds spent by all writes (as
    measured from __make_request() to end_that_request_last()).
Field  9 -- # of I/Os currently in progress
    The only field that should go to zero. Incremented as requests are
    given to appropriate struct request_queue and decremented as they finish.
Field 10 -- # of milliseconds spent doing I/Os
    This field increases so long as field 9 is nonzero.
Field 11 -- weighted # of milliseconds spent doing I/Os
    This field is incremented at each I/O start, I/O completion, I/O
    merge, or read of these stats by the number of I/Os in progress
    (field 9) times the number of milliseconds spent doing I/O since the
    last update of this field.  This can provide an easy measure of both
    I/O completion time and the backlog that may be accumulating.


