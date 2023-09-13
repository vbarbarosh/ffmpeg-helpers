const body_parser = require('body-parser');
const cli = require('@vbarbarosh/node-helpers/src/cli');
const express = require('express');
const express_routes = require('@vbarbarosh/express-helpers/src/express_routes');
const express_run = require('@vbarbarosh/express-helpers/src/express_run');
const ffmpeg_trim_crop_resize = require('../src/ffmpeg_trim_crop_resize');
const ffprobe = require('../src/ffprobe');
const fs_path_resolve = require('@vbarbarosh/node-helpers/src/fs_path_resolve');
const fs_tempdir = require('@vbarbarosh/node-helpers/src/fs_tempdir');
const shell = require('@vbarbarosh/node-helpers/src/shell');
const shell_json = require('@vbarbarosh/node-helpers/src/shell_json');

cli(main);

async function main()
{
    const app = express();

    app.use(body_parser.json());
    app.use(body_parser.urlencoded({extended: true}));

    express_routes(app, [
        {req: 'GET /', fn: help},
        {req: 'POST /', fn: ffmpeg},
        {req: 'ALL *', fn: page404},
    ]);

    await express_run(app, 3000, '0.0.0.0');
}

async function page404(req, res)
{
    res.status(404).send(`Page not found: ${req.path}`);
}

async function help(req, res)
{
    res.type('text').send(`usage:
POST / {trim: [{start: 0, end: 5}, {start: 8: end: 9}], crop: {x: 0, y: 0, w: 100, h: 100}, resize: {w: 50, h: 50}}
`);
}

async function ffmpeg(req, res)
{
    await fs_tempdir(async function (d) {
        // https://test-videos.co.uk/bigbuckbunny/mp4-h264
        const input_url = req.body.input_url || 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/1080/Big_Buck_Bunny_1080_10s_30MB.mp4';
        const trim = req.body.trim || null;
        const crop = req.body.crop || null;
        const resize = req.body.resize || null;
        const output = fs_path_resolve(d, 'a.mp4');
        const input = fs_path_resolve(d, 'input');
        log(`Downloading ${input_url}...`);
        await shell(['curl', '-sfS', input_url, '-o', input], {timeout: 30000});
        log(`Reading metadata...`);
        const probe = await shell_json(ffprobe({input}));
        log(`Rendering mp4...`);
        await shell(ffmpeg_trim_crop_resize({probe, input, output, trim, crop, resize}), {timeout: 30000});
        log('Sending mp4 back...');
        res.sendFile(output);
        log('Done');
    });
}

function log(s)
{
    console.log(s);
}
