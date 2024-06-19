const child_process = require('child_process');
const format_percents = require('@vbarbarosh/node-helpers/src/format_percents');
const format_seconds = require('@vbarbarosh/node-helpers/src/format_seconds');
const is_number_gt = require('@vbarbarosh/node-helpers/src/is_number_gt');
const make_progress = require('@vbarbarosh/node-helpers/src/make_progress');
const stream_ffmpeg_progress = require('./stream_ffmpeg_progress');
const stream_lines = require('./stream_lines');

async function shell_ffmpeg_progress(args, {probe, duration_us, progress_fn, user_friendly_status, ...options})
{
    const proc = child_process.spawn(args[0], ['-v', 'error', '-progress', '-', ...args.slice(1)], {...options, stdio: ['pipe', 'pipe', 'pipe']});
    const p = duration_us ? make_progress(duration_us)
        : probe ? make_progress(1000000*probe.format.duration)
        : make_progress();

    const timer = setInterval(tick, 1000);

    let ffmpeg_progress = null;
    let end_stdout = function () {};
    let end_stderr = function () {};
    try {
        await new Promise(function (resolve, reject) {
            proc.once('error', reject);
            proc.once('exit', code => code ? reject(new Error(`Process terminated with code ${code}`)) : resolve());
            end_stdout = stream_ffmpeg_progress(proc.stdout, local_progress_fn);
            end_stderr = stream_lines(proc.stderr, line => console.log('[stderr]', line));
            function local_progress_fn(v) {
                const first = !ffmpeg_progress;
                ffmpeg_progress = v;
                if (progress_fn) {
                    progress_fn(v);
                }
                if (first) {
                    tick();
                }
            }
        });
    }
    finally {
        tick();
        clearInterval(timer);
        end_stdout();
        end_stderr();
    }

    function tick() {
        if (!user_friendly_status) {
            return;
        }
        if (!ffmpeg_progress) {
            p.update(0);
            user_friendly_status(`${format_percents(0)} | ~ duration=${format_seconds(p.duration)}`);
            return;
        }
        p.update(ffmpeg_progress.out_time_us);
        const eta_str = is_number_gt(p.eta, 0) ? format_seconds(p.eta) : '~';
        const bitrate = ffmpeg_progress.bitrate === 'N/A' ? '~' : ffmpeg_progress.bitrate;
        user_friendly_status(`${format_percents(p.percents)} | ${ffmpeg_progress.fps}fps ${bitrate} ETA ${eta_str} duration=${format_seconds(p.duration)}`);
    }
}

module.exports = shell_ffmpeg_progress;
