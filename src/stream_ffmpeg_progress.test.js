const assert = require('assert');
const fs = require('fs');
const fs_path_resolve = require('@vbarbarosh/node-helpers/src/fs_path_resolve');
const fs_read_json = require('@vbarbarosh/node-helpers/src/fs_read_json');
const stream = require('stream');
const stream_ffmpeg_progress = require('./stream_ffmpeg_progress');

describe('stream_ffmpeg_progress', function () {
    it('audio-rpad', async function () {
        const actual = await stream.compose(
            fs.createReadStream(fs_path_resolve(__dirname, 'progress.d/audio-rpad/stdout')),
            stream_ffmpeg_progress(),
        ).toArray();
        const expected = await fs_read_json(fs_path_resolve(__dirname, 'progress.d/audio-rpad/stream_ffmpeg_progress.json'));
        assert.deepStrictEqual(actual, expected);
    });
    it('video-shortest', async function () {
        const actual = await stream.compose(
            fs.createReadStream(fs_path_resolve(__dirname, 'progress.d/video-shortest/stdout')),
            stream_ffmpeg_progress(),
        ).toArray();
        const expected = await fs_read_json(fs_path_resolve(__dirname, 'progress.d/video-shortest/stream_ffmpeg_progress.json'));
        assert.deepStrictEqual(actual, expected);
    });
});
