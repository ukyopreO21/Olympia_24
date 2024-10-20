import * as main from "./main.js";

export const handle = () => {
    window.updateData = updateData;

    const form = document.getElementById("upload-form");
    form.addEventListener("submit", (e) => {
        try {
            e.preventDefault();
            const formData = new FormData(form);

            fetch(form.action, {
                method: form.method,
                body: formData,
            })
                .then((response) => {
                    return response.text();
                })
                .then((text) => {
                    console.log(text);
                })
                .catch((error) => {
                    console.error(error);
                });
        } catch (err) {
            console.log(err);
        }
    });
};

export const updateData = () => {
    if (confirm("Bạn có chắc chắn với thao tác cập nhật dữ liệu chưa? Sau khi bạn ấn OK, dữ liệu sẽ bị thay đổi. Vui lòng sao lưu dữ liệu trước để tránh sự cố mất mát")) {
        const data = [];
        const dbNumber = document.getElementById("database-select").value;
        //Start
        const STR = [];
        for (let i = 0; i < 5; i++) {
            const temp = [];
            if (i < 4) {
                for (let j = 0; j < 6; j++) {
                    const dad = document.getElementById("STR" + (i + 1) + "." + (j + 1));
                    temp[j] = {
                        subject: dad.querySelector(".STR_subject").value,
                        question: dad.querySelector(".STR_question").value,
                        answer: dad.querySelector(".STR_answer").value,
                        note: dad.querySelector(".STR_note").value,
                        mediaUrl: dad.querySelector(".STR_media").value,
                    };
                }
            } else {
                for (let j = 0; j < 12; j++) {
                    const dad = document.getElementById("STR" + (i + 1) + "." + (j + 1));
                    temp[j] = {
                        subject: dad.querySelector(".STR_subject").value,
                        question: dad.querySelector(".STR_question").value,
                        answer: dad.querySelector(".STR_answer").value,
                        note: dad.querySelector(".STR_note").value,
                        mediaUrl: dad.querySelector(".STR_media").value,
                    };
                }
            }
            STR.push(temp);
        }
        data.push(STR);
        //Obstacle
        const OBS = [];
        for (let i = 0; i < 5; i++) {
            const dad = document.getElementById("OBS_row" + (i + 1));
            OBS[i] = {
                question: dad.querySelector(".OBS_question").value,
                answer: dad.querySelector(".OBS_answer").value,
                note: dad.querySelector(".OBS_note").value,
                mediaUrl: dad.querySelector(".OBS_media").value,
            };
            if (i != 4) OBS[i].startPos = document.getElementById("OBS_start-pos-" + (i + 1)).value;
        }
        OBS[5] = {
            answer: document.getElementById("OBS_keyword").value,
            mediaUrl: document.getElementById("OBS_image-url").value,
        };
        data.push(OBS);
        //Acceleration
        const ACC = [];
        for (let i = 0; i < 4; i++) {
            const dad = document.getElementById("ACC" + (i + 1));
            ACC[i] = {
                question: dad.querySelector(".ACC_question").value,
                answer: dad.querySelector(".ACC_answer").value,
                type: dad.querySelector(".ACC_media-type").value,
                note: dad.querySelector(".ACC_note").value,
                mediaUrl: dad.querySelector(".ACC_media").value,
                answerImage: dad.querySelector(".ACC_answer-image").value,
            };
        }
        data.push(ACC);
        //Finish
        const FIN = [];
        for (let i = 0; i < 4; i++) {
            const temp = [];
            for (let j = 0; j < 6; j++) {
                const dad = document.getElementById("FIN" + (i + 1) + "." + (j + 1));
                temp[j] = {
                    question: dad.querySelector(".FIN_question").value,
                    answer: dad.querySelector(".FIN_answer").value,
                    note: dad.querySelector(".FIN_note").value,
                    mediaUrl: dad.querySelector(".FIN_media").value,
                };
            }
            FIN.push(temp);
        }
        data.push(FIN);
        //Sub Finish
        const SFI = [];
        for (let i = 0; i < 3; i++) {
            const dad = document.getElementById("SFI" + (i + 1));
            SFI[i] = {
                question: dad.querySelector(".SFI_question").value,
                answer: dad.querySelector(".SFI_answer").value,
                note: dad.querySelector(".SFI_note").value,
                mediaUrl: dad.querySelector(".SFI_media").value,
            };
        }
        data.push(SFI);
        main.socket.emit("updateData", { data, dbNumber });
    }
};
