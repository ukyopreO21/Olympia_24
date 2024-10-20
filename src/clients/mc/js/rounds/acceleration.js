import * as main from "../main.js";

export const handle = () => {
    main.socket.on("_ACC_openQuestion", (questionData) => {
        document.querySelector("#ACC_question .question-content label").textContent = questionData.question;
        document.querySelector("#ACC_answer .answer-content label").textContent = questionData.answer;
        document.querySelector("#ACC_note .note-content label").textContent = questionData.note;
        if (questionData.type == "Video") {
            document.getElementById("ACC_video").src = questionData.mediaUrl;
        } else {
            document.getElementById("ACC_image").src = questionData.mediaUrl;
        }
    });

    main.socket.on("ACC_sendQuestionNumber", (questionNumber) => {
        document.getElementById("ACC_question-number").innerHTML = main.templateLabel("Câu hỏi số:") + "&nbsp;" + questionNumber;
    });

    main.socket.on("_ACC_startTiming", (data) => {
        main.countDown(data.questionNumber * 10);
        document.getElementById("ACC_video").play();
    });

    main.socket.on("_ACC_showAnswer", (answerData) => {
        for (let i = 1; i <= 4; i++) {
            document.getElementById("answer-name-" + i).textContent = answerData[i - 1].name;
            let time = String(answerData[i - 1].time);
            if (time[time.length - 2] == ".") time += "0";
            document.getElementById("answer-text-" + i).innerHTML = answerData[i - 1].answer + "<br>" + "[" + time + "]";
        }
    });

    main.socket.on("_ACC_showQuestionAnswer", (questionData) => {
        if (questionData.type == "Image") {
            document.getElementById("ACC_image").src = questionData.answerImage;
        }
    });

    main.socket.on("_ACC_closeQuestion", () => {
        document.getElementById("ACC_question-number").innerHTML = main.templateLabel("Câu hỏi số:");
        document.querySelector("#ACC_question .question-content label").textContent = ACC_questionData.question;
        document.querySelector("#ACC_answer .answer-content label").textContent = ACC_questionData.answer;
        document.querySelector("#ACC_note .note-content label").textContent = ACC_questionData.note;
        document.getElementById("ACC_video").src = "";
        document.getElementById("ACC_image").src = "";
    });
};
