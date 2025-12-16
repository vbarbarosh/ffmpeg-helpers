function ffprobe_codec_name(ffprobe)
{
    return ffprobe.streams.find(v => v.codec_name).codec_name;
}

module.exports = ffprobe_codec_name;
