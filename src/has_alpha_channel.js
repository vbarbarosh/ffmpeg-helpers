const ffprobe = require('./ffprobe');
const shell_json = require('./node_helpers/shell_json');

async function has_alpha_channel(file)
{
    const json = await shell_json(ffprobe(file));
    return Boolean(json.streams.find(function (v) {
        return (v.codec_name === 'vp8' || v.codec_name === 'vp9')
            && (v.pix_fmt === 'yuv420p')
            && (v.tags.alpha_mode || v.tags.ALPHA_MODE);
    }));
}

module.exports = has_alpha_channel;
