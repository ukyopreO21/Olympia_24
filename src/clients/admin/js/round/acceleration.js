import * as main from "../main.js";
import * as funcs from "../funcs.js";

var downloadTimer;

export const handle = () => {
    main.socket.on("_ACC_openQuestion", (questionData) => {
        funcs.setQuestionData(questionData);
        if (questionData.type == "Video") {
            document.getElementById("ACC_video").src = questionData.mediaUrl;
            document.getElementById("ACC_video").style.visibility = "visible";
            document.getElementById("ACC_image").style.visibility = "hidden";
        } else {
            document.getElementById("ACC_image").src = questionData.mediaUrl;
            document.getElementById("ACC_video").style.visibility = "hidden";
            document.getElementById("ACC_image").style.visibility = "visible";
        }
    });

    main.socket.on("_ACC_checkVideoSource", (playerNumber) => {
        document.getElementById("ACC_status-" + playerNumber).innerHTML = "TS" + playerNumber + ": <font color='greenyellow'>Đã tải được video</font>";
    });

    main.socket.on("_ACC_startTiming", () => {
        document.getElementById("ACC_video").play();
    });

    main.socket.on("_ACC_sendAnswer", (serverData) => {
        const answerLabel = "answer-" + serverData.answerData.playerNumber;
        document.getElementById(answerLabel).textContent = serverData.answerData.playerAnswer;
        const timeLabel = "time-" + serverData.answerData.playerNumber;
        document.getElementById(timeLabel).textContent = serverData.costTime;
    });

    main.socket.on("_ACC_showQuestionAnswer", (questionData) => {
        if (questionData.type == "Image") {
            document.getElementById("ACC_image").src = questionData.answerImage;
        }
    });
};

export const assignButton = () => {
    window.chooseQuestion = chooseQuestion;
    window.openQuestion = openQuestion;
    window.startTiming = startTiming;
    window.showAnswers = showAnswers;
    window.showQuestionAnswer = showQuestionAnswer;
    window.right = right;
    window.wrong = wrong;
    window.turnOffQuestion = turnOffQuestion;
    window.clearData = clearData;
    window.questionScreen = questionScreen;
    window.answerScreen = answerScreen;
};

export const printPlayerVideoStatus = () => {
    const dad = document.getElementById("ACC_info");
    dad.innerHTML += "<div id='ACC_player-video-status'>";
    const status = document.getElementById("ACC_player-video-status");
    status.innerHTML = "";
    status.innerHTML += "<div>Trạng thái load video của thí sinh:</div>";
    status.innerHTML += "<div id='ACC_status-1'>TS1: <font color='#FF6961'>Chưa tải được video</font></div>";
    status.innerHTML += "<div id='ACC_status-2'>TS2: <font color='#FF6961'>Chưa tải được video</font></div>";
    status.innerHTML += "<div id='ACC_status-3'>TS3: <font color='#FF6961'>Chưa tải được video</font></div>";
    status.innerHTML += "<div id='ACC_status-4'>TS4: <font color='#FF6961'>Chưa tải được video</font></div>";
    dad.innerHTML += "<div id='ACC_media'>";
    const media = document.getElementById("ACC_media");
    media.innerHTML += "<img id='ACC_image'>";
    media.innerHTML += "<video preload='auto' disablePictureInPicture controlsList='nodownload' id='ACC_video'></video>";
};

const chooseQuestion = () => {
    main.socket.emit("ACC_chooseQuestion");
    funcs.sendPlayerData();
};

const openQuestion = () => {
    for (let i = 1; i <= 4; i++) {
        document.getElementById("ACC_status-" + i).innerHTML = "TS" + i + ": <font color='#FF6961'>Chưa tải được video</font></div>";
    }
    const questionNumber = Number(document.getElementById("ACC_question-number").value);
    main.socket.emit("ACC_openQuestion", questionNumber);
};

const timing = (time) => {
    clearInterval(downloadTimer);
    document.getElementById("ACC_time").textContent = time;
    let timeLeft = time - 1;
    downloadTimer = setInterval(() => {
        document.getElementById("ACC_time").textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(downloadTimer);
        }
        timeLeft -= 1;
    }, 1000);
};

const startTiming = () => {
    for (let i = 1; i <= 4; i++) {
        document.getElementById("time-" + i).textContent = "0.00";
        document.getElementById("answer-" + i).textContent = "";
    }
    const questionNumber = Number(document.getElementById("ACC_question-number").value);
    timing(questionNumber * 10);
    main.socket.emit("ACC_startTiming", questionNumber);
};

const showAnswers = () => {
    const formatTime = (time) => {
        const seconds = Math.floor(time);
        const ticks = Math.round((time - seconds) * 100);
        const formattedTicks = String(ticks).padStart(2, "0");
        return seconds + "." + formattedTicks;
    };

    const answerData = [];
    for (let i = 0; i < 4; i++) {
        answerData[i] = {};
        answerData[i].answer = document.getElementById("answer-" + (i + 1)).textContent;
        answerData[i].name = document.getElementById("name-" + (i + 1)).textContent;
        answerData[i].time = Number(document.getElementById("time-" + (i + 1)).textContent);
    }
    answerData.sort((a, b) => {
        return a.time - b.time;
    });

    answerData.forEach((data) => {
        data.time = formatTime(data.time);
    });

    let rank = 0;
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (document.getElementById("time-" + (j + 1)).textContent == answerData[i].time && answerData[i].answer != "") {
                document.getElementById("signal-" + (j + 1)).textContent = ++rank;
                break;
            }
        }
    }
    main.socket.emit("ACC_showAnswers", answerData);
};

const showQuestionAnswer = () => {
    const questionNumber = Number(document.getElementById("ACC_question-number").value);
    main.socket.emit("ACC_showQuestionAnswer", questionNumber);
};

const countPoint = (playerAnswerInfo) => {
    let currentPoint = 40;
    let firstRight = false;
    for (let i = 0; i < 4; i++) {
        if (playerAnswerInfo[i].checked) {
            if (!firstRight) {
                playerAnswerInfo[i].point = currentPoint;
                firstRight = true;
            } else {
                if (playerAnswerInfo[i].time != playerAnswerInfo[i - 1].time) {
                    currentPoint -= 10;
                }
                playerAnswerInfo[i].point = currentPoint;
            }
        }
        document.getElementById("check-" + (i + 1)).checked = false;
        const point = document.getElementById("player-point-" + playerAnswerInfo[i].playerNumber);
        point.value = Number(point.value) + playerAnswerInfo[i].point;
    }
    funcs.sendPlayerData();
};

const right = () => {
    const playerAnswerInfo = [];
    for (let i = 1; i <= 4; i++) {
        playerAnswerInfo[i - 1] = {};
        playerAnswerInfo[i - 1].time = Number(document.getElementById("time-" + i).textContent);
        playerAnswerInfo[i - 1].playerNumber = i;
        playerAnswerInfo[i - 1].checked = document.getElementById("check-" + i).checked;
        playerAnswerInfo[i - 1].point = 0;
        playerAnswerInfo[i - 1].signal = document.getElementById("signal-" + i).textContent;
    }
    playerAnswerInfo.sort((a, b) => {
        return a.time - b.time;
    });
    main.socket.emit("ACC_right", playerAnswerInfo);
    countPoint(playerAnswerInfo);
};

const wrong = () => {
    for (let i = 1; i <= 4; i++) document.getElementById("check-" + i).checked = false;
    main.socket.emit("ACC_wrong");
};

const turnOffQuestion = () => {
    main.socket.emit("ACC_closeQuestion");
};

const clearData = () => {
    for (let i = 1; i <= 4; i++) {
        document.getElementById("signal-" + i).textContent = "";
        document.getElementById("answer-" + i).textContent = "";
        document.getElementById("time-" + i).textContent = "0.00";
    }
};

const questionScreen = () => {
    main.socket.emit("ACC_questionUI");
};

const answerScreen = () => {
    main.socket.emit("ACC_answerUI");
};
