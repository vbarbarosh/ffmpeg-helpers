```sh
# https://pixabay.com/music/jingles-toy-story-short-happy-audio-logo-short-cartoony-intro-outro-music-125627/
wget https://cdn.pixabay.com/download/audio/2022/11/11/audio_5d3ae71bc8.mp3?filename=toy-story-short-happy-audio-logo-short-cartoony-intro-outro-music-125627.mp3 -O a.mp3
wget https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/1080/Big_Buck_Bunny_1080_10s_30MB.mp4 -O a.mp4
ffmpeg -v error -nostdin -i a.mp3 -af 'apad=pad_dur=600' audio.mkv
ffmpeg -v error -progress - -nostdin -i a.mp4 -i a.mp3 -shortest out.mp4 > stdout
ffmpeg -i a.mp4 -i a.mp3 -shortest out.mp4
```
