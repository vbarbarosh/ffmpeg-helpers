const child_process = require('child_process');
const stream_ffmpeg_progress = require('./stream_ffmpeg_progress');
const stream_lines = require('./stream_lines');

async function shell_ffmpeg_progress(args, {progress_fn, ...options})
{
    const proc = child_process.spawn(args[0], ['-v', 'error', '-progress', '-', ...args.slice(1)], {...options, stdio: ['pipe', 'pipe', 'pipe']});

    let end_stdout = function () {};
    let end_stderr = function () {};
    try {
        await new Promise(function (resolve, reject) {
            proc.once('error', reject);
            proc.once('exit', code => code ? reject(new Error(`Process terminated with code ${code}`)) : resolve());
            end_stdout = stream_ffmpeg_progress(proc.stdout, progress_fn);
            end_stderr = stream_lines(proc.stderr, line => console.log('[stderr]', line));
        });
    }
    finally {
        end_stdout();
        end_stderr();
    }
}

module.exports = shell_ffmpeg_progress;
