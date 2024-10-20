import * as main from "./main.js";
import * as processor from "./processor.js";

export const chooseDatabase = () => {
    const dbNumber = Number(document.getElementById("database-select").value);
    main.socket.emit("chooseDb", dbNumber);
};

export const handle = () => {
    window.chooseDatabase = chooseDatabase;

    main.socket.on("_chooseDb", (dbData) => {
        //Start
        for (let i = 1; i <= 5; i++) {
            if (i <= 4) {
                for (let j = 1; j <= 6; j++) {
                    const div = document.getElementById("STR" + i + "." + j);
                    div.querySelector("textarea.STR_question").value = dbData.STR[i - 1][j - 1].question;
                    div.querySelector("textarea.STR_subject").value = dbData.STR[i - 1][j - 1].subject;
                    div.querySelector("textarea.STR_answer").value = dbData.STR[i - 1][j - 1].answer;
                    div.querySelector("textarea.STR_note").value = dbData.STR[i - 1][j - 1].note;
                    div.querySelector("textarea.STR_media").value = dbData.STR[i - 1][j - 1].mediaUrl;
                    processor.autoResizeByServer("STR" + i + "." + j);
                }
            } else {
                for (let j = 1; j <= 12; j++) {
                    const div = document.getElementById("STR" + i + "." + j);
                    div.querySelector("textarea.STR_question").value = dbData.STR[i - 1][j - 1].question;
                    div.querySelector("textarea.STR_subject").value = dbData.STR[i - 1][j - 1].subject;
                    div.querySelector("textarea.STR_answer").value = dbData.STR[i - 1][j - 1].answer;
                    div.querySelector("textarea.STR_note").value = dbData.STR[i - 1][j - 1].note;
                    div.querySelector("textarea.STR_media").value = dbData.STR[i - 1][j - 1].mediaUrl;
                    processor.autoResizeByServer("STR" + i + "." + j);
                }
            }
        }
        //Obstacle
        document.getElementById("OBS_keyword").value = dbData.OBS[5].answer;
        document.getElementById("OBS_image").src = dbData.OBS[5].mediaUrl;
        document.getElementById("OBS_image-url").value = dbData.OBS[5].mediaUrl;
        for (let i = 1; i <= 5; i++) {
            const div = document.getElementById("OBS_row" + i);
            div.querySelector("textarea.OBS_question").value = dbData.OBS[i - 1].question;
            div.querySelector("textarea.OBS_answer").value = dbData.OBS[i - 1].answer;
            div.querySelector("textarea.OBS_note").value = dbData.OBS[i - 1].note;
            div.querySelector("textarea.OBS_media").value = dbData.OBS[i - 1].mediaUrl;
            processor.autoResizeByServer("OBS_row" + i);
            if (i < 5) {
                document.getElementById("OBS_start-pos-" + i).value = dbData.OBS[i - 1].startPos;
                document.getElementById("OBS_recommend-pos-" + i).textContent = Math.floor((18 - Number(dbData.OBS[i - 1].rowLength)) / 2 + 1);
                processor.OBS_checkLegitStartPos(dbData.OBS[i - 1].rowLength, dbData.OBS[i - 1].startPos, i);
            }
        }
        //Acceleration
        for (let i = 1; i <= 4; i++) {
            const div = document.getElementById("ACC" + i);
            div.querySelector("textarea.ACC_question").value = dbData.ACC[i - 1].question;
            div.querySelector("textarea.ACC_answer").value = dbData.ACC[i - 1].answer;
            div.querySelector("textarea.ACC_media-type").value = dbData.ACC[i - 1].type;
            div.querySelector("textarea.ACC_note").value = dbData.ACC[i - 1].note;
            div.querySelector("textarea.ACC_media").value = dbData.ACC[i - 1].mediaUrl;
            div.querySelector("textarea.ACC_answer-image").value = dbData.ACC[i - 1].answerImage;
            processor.autoResizeByServer("ACC" + i);
        }
        //Finish
        for (let i = 1; i <= 4; i++) {
            for (let j = 1; j <= 6; j++) {
                const div = document.getElementById("FIN" + i + "." + j);
                div.querySelector("textarea.FIN_question").value = dbData.FIN[i - 1][j - 1].question;
                div.querySelector("textarea.FIN_answer").value = dbData.FIN[i - 1][j - 1].answer;
                div.querySelector("textarea.FIN_note").value = dbData.FIN[i - 1][j - 1].note;
                div.querySelector("textarea.FIN_media").value = dbData.FIN[i - 1][j - 1].mediaUrl;
                processor.autoResizeByServer("FIN" + i + "." + j);
            }
        }
        //Sub Finish
        for (let i = 1; i <= 3; i++) {
            const div = document.getElementById("SFI" + i);
            div.querySelector("textarea.SFI_question").value = dbData.SFI[i - 1].question;
            div.querySelector("textarea.SFI_answer").value = dbData.SFI[i - 1].answer;
            div.querySelector("textarea.SFI_note").value = dbData.SFI[i - 1].note;
            div.querySelector("textarea.SFI_media").value = dbData.SFI[i - 1].mediaUrl;
            processor.autoResizeByServer("SFI" + i);
        }
    });
};
