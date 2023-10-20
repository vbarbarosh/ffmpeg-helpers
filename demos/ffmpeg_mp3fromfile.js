const cli = require('@vbarbarosh/node-helpers/src/cli');
const ffmpeg_mp3fromfile = require('../src/ffmpeg_mp3fromfile');
const ffprobe = require('../src/ffprobe');
const fs_path_resolve = require('@vbarbarosh/node-helpers/src/fs_path_resolve');
const shell_ffmpeg_progress = require('../src/shell_ffmpeg_progress');
const shell_json = require('@vbarbarosh/node-helpers/src/shell_json');

cli(main);

async function main()
{
    const input = fs_path_resolve(__dirname, '../var/BCG 1 Hour Countdown (LED Frame Counter 180,000 Frames - 50 FPS) Remix BBC Arabic Countdown [ZSOdXPoMuu8].webm');
    const probe = await shell_json(ffprobe({input}));
    const expected_duration_us = 1000000*probe.format.duration;
    await shell_ffmpeg_progress(ffmpeg_mp3fromfile({input, output: 'a.mp3'}).concat('-y'), {
        progress_fn: function (v) {
            console.log(`${v.out_time_us} of ${expected_duration_us} ${(v.out_time_us/expected_duration_us*100).toFixed(2)}%`);
        },
    });
    console.log('done');
}
