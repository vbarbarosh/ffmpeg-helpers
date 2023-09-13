const assert = require('assert');
const ffmpeg_trim_crop_resize = require('./ffmpeg_trim_crop_resize');
const fs_lsr = require('@vbarbarosh/node-helpers/src/fs_lsr');
const fs_path_basename = require('@vbarbarosh/node-helpers/src/fs_path_basename');
const fs_path_dirname = require('@vbarbarosh/node-helpers/src/fs_path_dirname');
const fs_path_resolve = require('@vbarbarosh/node-helpers/src/fs_path_resolve');
const fs_read_json = require('@vbarbarosh/node-helpers/src/fs_read_json');

describe('init', async function () {
    before(async function () {
        const files = await fs_lsr(fs_path_resolve(__dirname, 'ffmpeg_trim_crop_resize.d'));
        describe('ffmpeg_trim_crop_resize', function () {
            for (const file of files) {
                if (file.basename !== 'input.json') {
                    continue;
                }
                it(fs_path_basename(fs_path_dirname(file.pathname)), async function () {
                    const d = fs_path_dirname(file.pathname);
                    const input = await fs_read_json(fs_path_resolve(d, 'input.json'));
                    const output = await fs_read_json(fs_path_resolve(d, 'output.json'));
                    const actual = ffmpeg_trim_crop_resize(input);
                    assert.deepStrictEqual(actual, output);
                });
            }
        });
    });
    it('init', function () {
        assert.equal(1, 1);
    })
});
