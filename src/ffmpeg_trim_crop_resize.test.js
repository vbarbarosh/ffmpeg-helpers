const assert = require('assert');
const ffmpeg_trim_crop_resize = require('./ffmpeg_trim_crop_resize');
const fs_lsr = require('@vbarbarosh/node-helpers/src/fs_lsr');
const fs_path_dirname = require('@vbarbarosh/node-helpers/src/fs_path_dirname');
const fs_path_resolve = require('@vbarbarosh/node-helpers/src/fs_path_resolve');
const fs_read_json = require('@vbarbarosh/node-helpers/src/fs_read_json');

describe('ffmpeg_trim_crop_resize', function () {
    it('should pass tests from ffmpeg_trim_crop_resize.d', async function () {
        const files = await fs_lsr(fs_path_resolve(__dirname, 'ffmpeg_trim_crop_resize.d'));
        for (let file of files) {
            if (file.basename !== 'input.json') {
                continue;
            }
            const d = fs_path_dirname(file.pathname);
            const input = await fs_read_json(fs_path_resolve(d, 'input.json'));
            const output = await fs_read_json(fs_path_resolve(d, 'output.json'));
            try {
                const actual = ffmpeg_trim_crop_resize(input);
                assert.deepStrictEqual(actual, output, d);
            }
            catch (error) {
                console.log(d);
                throw error;
            }
        }
    });
});
