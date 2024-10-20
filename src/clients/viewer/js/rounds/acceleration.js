import * as audio from "../../../../modules/clients-side/audio.js";
import * as main from "../main.js";

const mainTimeAudio = new Audio();

export const handle = () => {
    main.socket.on("_ACC_chooseQuestion", () => {
        answerInterface("hidden");
        questionInterface("visible");
        document.getElementById("ACC_question-zone").addEventListener("animationend", (event) => {
            if (event.animationName === "ACC_move-main-interface") {
                document.getElementById("ACC_question-zone").classList.remove("ACC_show-board");
                void document.getElementById("ACC_question-zone").offsetHeight;
                document.getElementById("ACC_question-zone").classList.add("ACC_show-board");
            }
        });
        document.getElementById("ACC_question-zone").addEventListener("animationend", (event) => {
            if (event.animationName === "ACC_show-board") {
                document.getElementById("ACC_question-bar-zone").classList.remove("ACC_show-question-bar");
                void document.getElementById("ACC_question-bar-zone").offsetHeight;
                document.getElementById("ACC_question-bar-zone").classList.add("ACC_show-question-bar");
            }
        });

        document.getElementById("ACC_question-zone").classList.remove("ACC_move-main-interface");
        document.getElementById("ACC_question-zone").classList.remove("ACC_show-board");
        document.getElementById("ACC_question-bar-zone").classList.remove("ACC_show-question-bar");
        void document.getElementById("ACC_question-zone").offsetHeight;
        void document.getElementById("ACC_question-bar-zone").offsetHeight;
        document.getElementById("ACC_question-zone").classList.add("ACC_move-main-interface");

        audio.ACC_openQuestionAudio.pause();
        audio.ACC_openQuestionAudio.currentTime = 0;
        audio.ACC_openQuestionAudio.play();
    });

    main.socket.on("_ACC_openQuestion", (questionData) => {
        document.getElementById("ACC_video").style.visibility = "hidden";
        document.getElementById("ACC_question").textContent = questionData.question;
        if (questionData.type == "Video") {
            document.getElementById("ACC_image").style.display = "none";
            document.getElementById("ACC_video").style.display = "block";
            document.getElementById("ACC_image").src = "";
            document.getElementById("ACC_video").src = questionData.mediaUrl;
        } else {
            document.getElementById("ACC_video").style.display = "none";
            document.getElementById("ACC_image").style.display = "block";
            document.getElementById("ACC_video").src = "";
            document.getElementById("ACC_image").src = questionData.mediaUrl;
        }
    });

    main.socket.on("_ACC_startTiming", (data) => {
        timing(data.questionNumber * 10);
        removeAllTimingAnimation();
        const circle = document.getElementById("ACC_circle");
        void circle.offsetWidth;
        const line = document.getElementById("ACC_line");
        void line.offsetWidth;
        document.getElementById("ACC_circle").classList.add("move-circle-" + data.questionNumber * 10);
        document.getElementById("ACC_line").classList.add("move-line-" + data.questionNumber * 10);
    });

    main.socket.on("_ACC_showAnswer", (answerData) => {
        questionInterface("hidden");
        answerInterface("visible");
        audio.ACC_showAnswersAudio.pause();
        audio.ACC_showAnswersAudio.currentTime = 0;
        audio.ACC_showAnswersAudio.play();
        document.getElementById("ACC_outer-line").classList.remove("ACC_extend-outer");
        void document.getElementById("ACC_outer-line").offsetWidth;
        document.getElementById("ACC_outer-line").classList.add("ACC_extend-outer");
        for (let i = 1; i <= 4; i++) {
            document.getElementById("ACC_player-" + i).style.opacity = "1";
            document.querySelector("#ACC_player-" + i + " .ACC_name-text").textContent = answerData[i - 1].name;
            document.querySelector("#ACC_player-" + i + " .ACC_time-text").textContent = answerData[i - 1].time;
            document.querySelector("#ACC_player-" + i + " .ACC_answer-text").textContent = answerData[i - 1].answer;

            const player = document.getElementById("ACC_player-" + i);
            document.getElementById("ACC_pinner-" + i).classList.remove("ACC_move-pinner-" + i);
            void document.getElementById("ACC_pinner-" + i).offsetWidth;
            document.getElementById("ACC_pinner-" + i).classList.add("ACC_move-pinner-" + i);
            player.classList.remove("ACC_show-answer-" + i);
            void player.offsetWidth;
            player.classList.add("ACC_show-answer-" + i);
            player.querySelector(".ACC_time").classList.remove("ACC_move-time-" + i);
            void player.querySelector(".ACC_time").offsetWidth;
            player.querySelector(".ACC_time").classList.add("ACC_move-time-" + i);
        }
    });

    main.socket.on("_ACC_showQuestionAnswer", (questionData) => {
        if (questionData.type == "Image") {
            document.getElementById("ACC_image").src = questionData.answerImage;
        }
    });

    main.socket.on("_ACC_right", (answerData) => {
        audio.ACC_rightAudio.pause();
        audio.ACC_rightAudio.currentTime = 0;
        audio.ACC_rightAudio.play();
        for (let i = 0; i < 4; i++) {
            if (answerData[i].checked == false) {
                document.getElementById("ACC_player-" + (i + 1)).style.opacity = 0.3;
            }
        }
    });

    main.socket.on("_ACC_wrong", () => {
        audio.ACC_wrongAudio.pause();
        audio.ACC_wrongAudio.currentTime = 0;
        audio.ACC_wrongAudio.play();
        for (let i = 0; i < 4; i++) {
            document.getElementById("ACC_player-" + (i + 1)).style.opacity = 0.3;
        }
    });

    main.socket.on("_ACC_closeQuestion", () => {
        document.getElementById("ACC_question").textContent = "";
        document.getElementById("ACC_video").src = "";
        document.getElementById("ACC_image").src = "";
        questionInterface("hidden");
    });

    main.socket.on("_ACC_questionUI", () => {
        answerInterface("hidden");
        questionInterface("visible");
    });

    main.socket.on("_ACC_answerUI", () => {
        questionInterface("hidden");
        answerInterface("visible");
    });
};

const questionInterface = (visibility) => {
    document.getElementById("ACC_shelf").style.visibility = visibility;
    const dad = document.getElementById("ACC_question-zone");
    const child = dad.querySelectorAll("*");
    for (let i = 0; i < child.length; i++) {
        child[i].style.visibility = visibility;
    }
};

const answerInterface = (visibility) => {
    const dad = document.getElementById("ACC_answers");
    const child = dad.querySelectorAll("*");
    for (let i = 0; i < child.length; i++) {
        child[i].style.visibility = visibility;
    }
};

const timing = (time) => {
    const video = document.getElementById("ACC_video");
    mainTimeAudio.pause();
    if (video) {
        video.style.visibility = "visible";
        video.play();
    }
    if (time == 10) mainTimeAudio.src = audio.ACC_10secondsAudio.src;
    else if (time == 20) mainTimeAudio.src = audio.ACC_20secondsAudio.src;
    else if (time == 30) mainTimeAudio.src = audio.ACC_30secondsAudio.src;
    else mainTimeAudio.src = audio.ACC_40secondsAudio.src;
    mainTimeAudio.currentTime = 0;
    mainTimeAudio.play();
};

const removeAllTimingAnimation = () => {
    for (let i = 1; i <= 4; i++) {
        document.getElementById("ACC_line").classList.remove("move-line-" + i * 10);
        document.getElementById("ACC_circle").classList.remove("move-circle-" + i * 10);
    }
};
