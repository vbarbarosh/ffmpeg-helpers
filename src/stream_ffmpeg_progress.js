const stream = require('stream');
const stream_strpbrk = require('@vbarbarosh/node-helpers/src/stream_strpbrk');

function stream_ffmpeg_progress()
{
    let out = {};
    return stream.compose(
        stream_strpbrk(),
        new stream.Transform({
            objectMode: true,
            transform: function (line, encoding, callback) {
                const [, key, value] = line.match(/([^=]+)=\s*(.*)/);
                if (value.toLowerCase() === 'n/a') {
                    out[key] = null;
                }
                else {
                    switch (key) {
                    case 'frame':
                    case 'fps':
                    case 'total_size':
                    case 'out_time_us':
                    case 'out_time_ms':
                    case 'dup_frames':
                    case 'drop_frames':
                        out[key] = parseFloat(value);
                        break;
                    case 'progress':
                        out[key] = value;
                        this.push(out);
                        out = {};
                        break;
                    default:
                        out[key] = value;
                        break;
                    }
                }
                callback();
            },
            flush: function (callback) {
                if (Object.keys(out).length !== 0) {
                    this.push(out);
                }
                callback();
            },
        }),
    );
}

module.exports = stream_ffmpeg_progress;
