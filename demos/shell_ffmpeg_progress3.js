const cli = require('@vbarbarosh/node-helpers/src/cli');
const ffprobe = require('../src/ffprobe');
const fs_path_resolve = require('@vbarbarosh/node-helpers/src/fs_path_resolve');
const shell_ffmpeg_progress = require('../src/shell_ffmpeg_progress');
const shell_json = require('@vbarbarosh/node-helpers/src/shell_json');

cli(main);

async function main()
{
    const input = fs_path_resolve(__dirname, '../var/BCG 1 Hour Countdown (LED Frame Counter 180,000 Frames - 50 FPS) Remix BBC Arabic Countdown [ZSOdXPoMuu8].webm');
    await shell_ffmpeg_progress(['ffmpeg', '-i', input, 'a.mp4', '-y'], {
        probe: await shell_json(ffprobe({input})),
        user_friendly_status: s => console.log(`Creating mp4: ${s}`),
    });
    console.log('🎉 Done');
}
