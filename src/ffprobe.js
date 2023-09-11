function ffprobe({input})
{
    return ['ffprobe', input, '-v', 'quiet', '-print_format', 'json', '-show_format', '-show_streams'];
}

module.exports = ffprobe;
