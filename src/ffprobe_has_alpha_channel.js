function ffprobe_has_alpha_channel(ffprobe)
{
    return Boolean(ffprobe.streams.find(function (v) {
        return (v.codec_name === 'vp8' || v.codec_name === 'vp9')
            && (v.pix_fmt === 'yuv420p')
            && (v.tags.alpha_mode || v.tags.ALPHA_MODE);
    }));
}

module.exports = ffprobe_has_alpha_channel;
