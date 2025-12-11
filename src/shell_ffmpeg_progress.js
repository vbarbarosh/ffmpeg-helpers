const child_process = require('child_process');
const format_ffmpeg_progress = require('./format_ffmpeg_progress');
const stream = require('stream');
const stream_each = require('@vbarbarosh/node-helpers/src/stream_each');
const stream_ffmpeg_progress = require('./stream_ffmpeg_progress');

async function shell_ffmpeg_progress(args, {user_friendly_status = s => console.log(s), ...options})
{
    const proc = child_process.spawn(args[0], ['-v', 'error', '-progress', '-', ...args.slice(1)], {...options, stdio: ['pipe', 'pipe', 'pipe']});
    let last_out_time = null;
    let last_out_time_ms = null;
    let last_out_time_us = null;

    await Promise.all([
        new Promise(function (resolve, reject) {
            proc.once('error', reject);
            proc.once('exit', code => code ? reject(new Error(`Process terminated with code ${code}`)) : resolve());
        }),
        stream.promises.pipeline(proc.stdout, stream_ffmpeg_progress(), stream_each(progress_fn))
    ]);

    function progress_fn(ffmpeg_progress) {
        ffmpeg_progress.out_time ??= last_out_time;
        ffmpeg_progress.out_time_ms ??= last_out_time_ms;
        ffmpeg_progress.out_time_us ??= last_out_time_us;
        last_out_time = ffmpeg_progress.out_time;
        last_out_time_ms = ffmpeg_progress.out_time_ms;
        last_out_time_us = ffmpeg_progress.out_time_us;
        user_friendly_status(format_ffmpeg_progress(ffmpeg_progress));
    }
}

module.exports = shell_ffmpeg_progress;
