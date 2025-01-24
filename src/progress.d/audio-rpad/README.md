```sh
# https://pixabay.com/music/jingles-toy-story-short-happy-audio-logo-short-cartoony-intro-outro-music-125627/
wget https://cdn.pixabay.com/download/audio/2022/11/11/audio_5d3ae71bc8.mp3?filename=toy-story-short-happy-audio-logo-short-cartoony-intro-outro-music-125627.mp3 -O a.mp3
ffmpeg -v error -progress - -nostdin -i a.mp3 -af 'apad=pad_dur=600' audio.mkv > stdout
```
