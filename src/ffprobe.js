function ffprobe({input})
{
    return ['ffprobe', input, '-v', 'quiet', '-print_format', 'json', '-show_format'];
}

export default ffprobe;
