const format_bytes = require('@vbarbarosh/node-helpers/src/format_bytes');

function format_ffmpeg_progress(ffmpeg_progress)
{
    if (!ffmpeg_progress) {
        return '~';
    }

    const {frame, fps, bitrate, out_time, total_size, speed} = ffmpeg_progress;

    const tmp = [];
    total_size && tmp.push(`size=${format_bytes(total_size)}`);
    frame && tmp.push(`frame=${frame}`);
    fps && tmp.push(`fps=${fps}`);
    bitrate && tmp.push(`bitrate=${bitrate}`);
    out_time && tmp.push(`time=${out_time}`);
    speed && tmp.push(`speed=${speed}`);

    return tmp.join(' ') || '~';
}

module.exports = format_ffmpeg_progress;
