function ffprobe_has_alpha_channel(ffprobe)
{
    return Boolean(ffprobe.streams.find(function (v) {
        return (v.codec_name === 'vp8' || v.codec_name === 'vp9')
            && (v.tags?.alpha_mode === '1' || v.tags?.ALPHA_MODE === '1');
    }));
}

module.exports = ffprobe_has_alpha_channel;
