import * as main from "../main.js";

export const handle = () => {
    main.socket.on("_OBS_adminGetRoundData", (data) => {
        for (let i = 0; i < 5; i++) {
            const td = document.querySelectorAll("#OBS_row-" + (i + 1) + " td");
            td[1].textContent = data[i].rowLength;
            td[2].textContent = data[i].answer;
        }
        const td = document.querySelectorAll("#OBS_keyword td");
        td[1].textContent = data[5].rowLength;
        td[2].textContent = data[5].answer;
        document.getElementById("OBS_image").src = data[5].mediaUrl;
    });

    main.socket.on("_OBS_showRowQuestion", (questionData) => {
        document.querySelector("#OBS_question .question-content label").textContent = questionData.question;
        document.querySelector("#OBS_answer .answer-content label").textContent = questionData.answer;
    });

    main.socket.on("_OBS_closeRowQuestion", () => {
        document.querySelector("#OBS_question .question-content label").textContent = "";
        document.querySelector("#OBS_answer .answer-content label").textContent = "";
    });

    main.socket.on("_OBS_start15s", () => {
        main.countDown(15);
    });

    main.socket.on("_OBS_signal", (signalData) => {
        const print = document.querySelector("#OBS_signals .OBS_print-signal");
        print.innerHTML +=
            '<div class="OBS_signal" id="OBS_signal' + signalData.numberOfSignals + '">' + signalData.numberOfSignals + ". " + main.allPlayerName[signalData.playerNumber - 1] + "</div>";
        document.getElementById("OBS_signal" + signalData.numberOfSignals).style.left = 25 * (Number(signalData.numberOfSignals) - 1) + "%";
    });

    main.socket.on("_OBS_showRowAnswer", (rowAnswerData) => {
        for (let i = 1; i <= 4; i++) {
            document.getElementById("answer-name-" + i).textContent = rowAnswerData.name[i - 1];
            document.getElementById("answer-text-" + i).textContent = rowAnswerData.answer[i - 1];
        }
    });

    main.socket.on("_OBS_openCorner", (currentRow) => {
        const hiders = document.querySelectorAll(".OBS_hider");
        hiders[currentRow - 1].style.visibility = "hidden";
    });

    main.socket.on("_OBS_rightObs", () => {
        showImage();
    });

    main.socket.on("_OBS_wrongObs", () => {
        document.getElementById("OBS_signals").innerHTML = "";
    });

    main.socket.on("_OBS_last15s", () => {
        main.countDown(15);
    });

    main.socket.on("_OBS_showObs", () => {
        showImage();
    });
};

const showImage = () => {
    const hiders = document.querySelectorAll(".OBS_hider");
    hiders.forEach((hider) => {
        hider.style.visibility = "hidden";
    });
};
