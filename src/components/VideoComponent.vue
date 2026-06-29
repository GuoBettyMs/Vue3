<template>
    <div class="video-container">
        <img width="200px" height="200px" src="../assets/img/豆包.png" alt="图像"></img>
        <video controls>
            <source 
            src="https://www.w3schools.com/html/movie.mp4" 
            type="video/mp4" 
            poster="../assets/img/default-bg.jpg"/>

            <!-- track 嵌入文本轨元素
                .vtt 文件: Web 视频文本轨 
                default: 此属性表示应启用该轨道
                kind="captions": 文本轨的使用方式,隐藏式字幕提供音频的文字记录，并可能包含翻译
                src: 轨道（.vtt 文件）的地址
                srclang: 轨道文本数据的语言
            -->
            <track
                default
                kind="captions"
                srclang="en"
                src="/assets/misc/videotest.vtt" />

            <p>
                你的浏览器不支持 HTML5 视频。这里有一个<a
                href="myVideo.mp4"
                download="myVideo.mp4"
                >视频</a
                >链接。
            </p>

            Download the
            <a href="https://www.w3schools.com/html/movie.mp4">MP4</a>
            video.

        </video>
    </div>
</template>