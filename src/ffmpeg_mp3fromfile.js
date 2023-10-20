// https://stackoverflow.com/a/36324719/1478566
function ffmpeg_mp3fromfile({input, output = 'a.mp3'})
{
    return ['ffmpeg', '-nostdin', '-i', input, '-q:a', 0, '-map', 'a', output];
}

module.exports = ffmpeg_mp3fromfile;
