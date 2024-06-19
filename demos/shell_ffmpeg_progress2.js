const cli = require('@vbarbarosh/node-helpers/src/cli');
const ffmpeg_trim_crop_resize = require('../src/ffmpeg_trim_crop_resize');
const ffprobe = require('../src/ffprobe');
const fs_path_resolve = require('@vbarbarosh/node-helpers/src/fs_path_resolve');
const shell_ffmpeg_progress = require('../src/shell_ffmpeg_progress');
const shell_json = require('@vbarbarosh/node-helpers/src/shell_json');

cli(main);

async function main()
{
    const input = fs_path_resolve(__dirname, '../var/BCG 1 Hour Countdown (LED Frame Counter 180,000 Frames - 50 FPS) Remix BBC Arabic Countdown [ZSOdXPoMuu8].webm');
    const probe = await shell_json(ffprobe({input}));
    const trim = [{start: 5, end: 10}, {start: 65, end: 70}, {start: 125, end: 130}];
    const duration_us = trim.length ? 1000000*trim.reduce((a,v) => a + v.end - v.start, 0) : 1000000*probe.format.duration;
    await shell_ffmpeg_progress(ffmpeg_trim_crop_resize({probe, input, output: 'a.mp4', trim}).concat('-y'), {
        duration_us,
        user_friendly_status: s => console.log(`Creating mp4: ${s}`),
    });
    console.log('🎉 Done');
}
