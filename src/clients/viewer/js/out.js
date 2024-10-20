import * as main from "./main.js";

const audio = new Audio();
audio.id = "out-sources-media";
document.body.appendChild(audio);

export const handle = () => {
    main.socket.on("_OUT_introVideo", () => {
        const intro = document.getElementById("intro-video");
        intro.style.visibility = "visible";
        intro.src = "/src/assets/Others/Intro.mp4";
        intro.play();
        intro.onended = () => {
            intro.style.visibility = "hidden";
        };
    });

    main.socket.on("_OUT_introAudio", () => {
        audio.pause();
        audio.src = "/src/assets/Others/Sounds/Intro.mp3";
        audio.play();
    });

    main.socket.on("_OUT_MC", () => {
        audio.pause();
        audio.src = "/src/assets/Others/Sounds/MCLenSanKhau.mp3";
        audio.play();
    });

    main.socket.on("_OUT_Player", () => {
        audio.pause();
        audio.src = "/src/assets/Others/Sounds/ThiSinhLenSanKhau.mp3";
        audio.play();
    });

    main.socket.on("_OUT_Introduce", (num) => {
        audio.pause();
        audio.src = "/src/assets/Others/Sounds/misc_introduction" + num + ".mp3";
        audio.play();
    });

    main.socket.on("_OUT_Flower", (num) => {
        audio.pause();
        audio.src = "/src/assets/Others/Sounds/TangHoa" + num + ".mp3";
        audio.play();
    });

    main.socket.on("_OUT_Ambience", () => {
        audio.pause();
        audio.src = "/src/assets/Others/Sounds/Anticipation.mp3";
        audio.play();
    });

    main.socket.on("_OUT_Result", (num) => {
        audio.pause();
        audio.src = "/src/assets/Others/Sounds/Ve" + num + ".mp3";
        audio.play();
    });

    main.socket.on("_OUT_Prize", (num) => {
        audio.pause();
        audio.src = "/src/assets/Others/Sounds/Award" + num + ".mp3";
        audio.play();
    });

    main.socket.on("_OUT_closeAllAudio", () => {
        const allMediaElements = document.querySelectorAll("audio, video");
        allMediaElements.forEach((mediaElement) => {
            mediaElement.src = "";
            mediaElement.pause(); // Tắt âm thanh
        });
    });
};
