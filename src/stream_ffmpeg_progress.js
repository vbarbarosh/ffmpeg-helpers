// Split stream into objects `{frame,fps,out_time_us,out_time,...}`
function stream_ffmpeg_progress(stream, fn)
{
    let utf8 = '';
    stream.on('data', data);
    stream.on('end', end);
    return off;

    function off() {
        stream.off('data', data);
        stream.off('end', end);
    }
    function end() {
        off();
        if (utf8) {
            fn(parse(utf8), true);
        }
    }
    function data(buffer) {
        utf8 += buffer.toString('utf8');
        for (let iteration = 1; true; ++iteration) {
            if (iteration === 1000000) {
                throw new Error('Too many iterations');
            }
            const si = 'progress=continue\n';
            const i = utf8.indexOf(si);
            if (i !== -1) {
                const line = utf8.substring(0, i + si.length);
                utf8 = utf8.substring(i + si.length);
                fn(parse(line), false);
                continue;
            }
            break;
        }
    }
    function parse(s) {
        // frame=1
        // fps=0.00
        // stream_0_0_q=0.0
        // bitrate= 184.0kbits/s
        // total_size=4762
        // out_time_us=207000
        // out_time_ms=207000
        // out_time=00:00:00.207000
        // dup_frames=0
        // drop_frames=0
        // speed=1.07x
        // progress=continue
        return Object.fromEntries(s.trim().split('\n').map(ss => ss.match(/([^=]+)=\s*(.*)/).slice(1)));
    }
}

module.exports = stream_ffmpeg_progress;
