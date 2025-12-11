const assert = require('assert');
const format_ffmpeg_progress_long = require('./format_ffmpeg_progress_long');
const fs_path_resolve = require('@vbarbarosh/node-helpers/src/fs_path_resolve');
const fs_read_json = require('@vbarbarosh/node-helpers/src/fs_read_json');

describe('format_ffmpeg_progress_long', function () {
    it('audio-rpad', async function () {
        const items = await fs_read_json(fs_path_resolve(__dirname, 'progress.d/audio-rpad/stream_ffmpeg_progress.json'));
        const actual = items.map(format_ffmpeg_progress_long);
        const expected = await fs_read_json(fs_path_resolve(__dirname, 'progress.d/audio-rpad/format_ffmpeg_progress_long.json'));
        assert.deepStrictEqual(actual, expected);
    });
    it('video-shortest', async function () {
        const items = await fs_read_json(fs_path_resolve(__dirname, 'progress.d/video-shortest/stream_ffmpeg_progress.json'));
        const actual = items.map(format_ffmpeg_progress_long);
        const expected = await fs_read_json(fs_path_resolve(__dirname, 'progress.d/video-shortest/format_ffmpeg_progress_long.json'));
        assert.deepStrictEqual(actual, expected);
    });
});
