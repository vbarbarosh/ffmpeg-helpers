const child_process = require('child_process');
const format_ffmpeg_progress_long = require('./format_ffmpeg_progress_long');
const stream = require('stream');
const stream_each = require('@vbarbarosh/node-helpers/src/stream_each');
const stream_ffmpeg_progress = require('./stream_ffmpeg_progress');

async function shell_ffmpeg_progress(args, {user_friendly_status = s => console.log(s), ...options})
{
    const proc = child_process.spawn(args[0], ['-v', 'error', '-progress', '-', ...args.slice(1)], {...options, stdio: ['pipe', 'pipe', 'pipe']});

    await Promise.all([
        new Promise(function (resolve, reject) {
            proc.once('error', reject);
            proc.once('exit', code => code ? reject(new Error(`Process terminated with code ${code}`)) : resolve());
        }),
        stream.promises.pipeline(proc.stdout, stream_ffmpeg_progress(), stream_each(progress_fn))
    ]);

    function progress_fn(ffmpeg_progress) {
        user_friendly_status(format_ffmpeg_progress_long(ffmpeg_progress));
    }
}

module.exports = shell_ffmpeg_progress;
