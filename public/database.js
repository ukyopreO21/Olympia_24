var socket = io();
const urlParams = new URLSearchParams(window.location.search);
const password = Number(urlParams.get("url"));
socket.emit("sendAdminPassword", sessionStorage.getItem("adminPassword"));
socket.emit("sendAdminPassword", password);

function sendAdminPassword() {
    socket.emit("sendAdminPassword", document.getElementById("passwordInput").value);
}

document.getElementById("passwordInput").addEventListener("keyup", function (event) {
    if (event.key === "Enter") sendAdminPassword();
});

socket.on("_sendAdminPassword", function (password) {
    sessionStorage.setItem("adminPassword", password);
    document.getElementById("password").style.display = "none";
});

async function listenOBSLength() {
    await markId();
    for (let i = 1; i <= 4; i++) {
        document.getElementById("OBS_startPos" + i).addEventListener("blur", function (event) {
            let name = event.target.name;
            let pos = Number(document.getElementById(event.target.id).value.replace(/\s/g, ""));
            document.getElementById(event.target.id).value = pos;
            let rowLength = document.querySelector("#OBS_row" + name + " .OBS_answer").value.replace(/\s/g, "").length;
            OBS_checkLegitStartPos(rowLength, pos, name);
        });

        document.querySelector("#OBS_row" + i + " .OBS_answer").addEventListener("keyup", function (event) {
            let name = event.target.name;
            let length = document.querySelector("#OBS_row" + name + " .OBS_answer").value.replace(/\s/g, "").length;
            let rcmPos = Math.floor((18 - length) / 2 + 1);
            let currentPos = Number(document.getElementById("OBS_startPos" + name).value.replace(/\s/g, ""));
            document.getElementById("OBS_rcmPos" + name).innerHTML = rcmPos;
            OBS_checkLegitStartPos(length, currentPos, name);
        });
    }
}

listenOBSLength();

function OBS_checkLegitStartPos(rowLength, pos, name) {
    if (rowLength > 0 && rowLength + Number(pos) - 1 <= 18 && pos > 0) document.getElementById("OBS_resultPos" + name).innerHTML = "<font color='white'>Hợp lệ</font>";
    else document.getElementById("OBS_resultPos" + name).innerHTML = "<font color='#FF6961'>Không hợp lệ</font>";
}

function resize(type, round) {
    if (!type || round == 0) {
        for (let i = 1; i <= 5; i++) {
            if (i <= 4) {
                for (let j = 1; j <= 6; j++) {
                    autoResizeByServer("STR" + i + "." + j);
                }
            } else {
                for (let j = 1; j <= 12; j++) {
                    autoResizeByServer("STR" + i + "." + j);
                }
            }
        }
    }
    if (!type || round == 1) {
        for (let i = 1; i <= 5; i++) {
            autoResizeByServer("OBS_row" + i);
        }
    }
    if (!type || round == 2) {
        for (let i = 1; i <= 4; i++) {
            autoResizeByServer("ACC" + i);
        }
    }
    if (!type || round == 3) {
        for (let i = 1; i <= 4; i++) {
            for (let j = 1; j <= 6; j++) {
                autoResizeByServer("FIN" + i + "." + j);
            }
        }
    }
    if (!type || round == 4) {
        for (let i = 1; i <= 3; i++) {
            autoResizeByServer("SFI" + i);
        }
    }
}

window.addEventListener("resize", function () {
    resize(0);
});

socket.on("serverRestarted", function () {
    window.location.reload();
});

socket.emit("getVersion");
socket.on("_getVersion", function (appVersion) {
    document.getElementById("currentVersion").textContent = appVersion;
});

document.getElementById("upload-form").addEventListener("submit", function (e) {
    try {
        e.preventDefault();
        var formData = new FormData(this);

        fetch(this.action, {
            method: this.method,
            body: formData,
        })
            .then(function (response) {
                return response.text();
            })
            .then(function (text) {
                console.log(text);
            })
            .catch(function (error) {
                console.error(error);
            });
    } catch (err) {
        console.log(err);
    }
});

function updateImage() {
    document.getElementById("OBS_image").src = document.getElementById("OBS_imageUrl").value;
}

function openQuestion(roundName) {
    let dad = document.querySelectorAll(".round");
    for (let i = 0; i < dad.length; i++) {
        if (dad[i].id != roundName) dad[i].style.display = "none";
        else {
            dad[i].style.display = "block";
            resize(1, i);
        }
    }
}

async function markId() {
    let strDiv = document.querySelectorAll("#start div");
    for (let i = 1; i <= 5; i++) {
        if (i < 5) {
            for (let j = 0; j < 6; j++) {
                strDiv[6 * (i - 1) + j].id = "STR" + i + "." + (j + 1);
            }
        } else {
            for (let j = 0; j < 12; j++) {
                strDiv[6 * (i - 1) + j].id = "STR" + i + "." + (j + 1);
            }
        }
    }
    let obsDiv = document.querySelectorAll(".OBS_row");
    for (let i = 0; i < obsDiv.length; i++) obsDiv[i].id = "OBS_row" + (i + 1);

    let accDiv = document.querySelectorAll("#acceleration div");
    for (let i = 0; i < accDiv.length; i++) accDiv[i].id = "ACC" + (i + 1);

    let finDiv = document.querySelectorAll("#finish div");
    for (let i = 1; i <= 4; i++) for (let j = 0; j < finDiv.length / 4; j++) finDiv[6 * (i - 1) + j].id = "FIN" + i + "." + (j + 1);

    let subFinishDiv = document.querySelectorAll("#subFinish div");
    for (let i = 0; i < subFinishDiv.length; i++) subFinishDiv[i].id = "SFI" + (i + 1);
}

function autoResizeByServer(currentDadId) {
    let div = document.getElementById(currentDadId);
    let textAreas = div.querySelectorAll("textarea");

    let maxHeight = 0;
    for (let i = 0; i < textAreas.length; i++) {
        textAreas[i].style.height = "";
        if (textAreas[i].scrollHeight > maxHeight) {
            maxHeight = textAreas[i].scrollHeight;
        }
    }

    for (let i = 0; i < textAreas.length; i++) {
        textAreas[i].style.height = maxHeight + 5 + "px";
    }
}

function autoResize(textarea) {
    let div = textarea.parentNode;
    let textAreas = div.querySelectorAll("textarea");

    let maxHeight = 0;
    for (let i = 0; i < textAreas.length; i++) {
        textAreas[i].style.height = "";
        if (textAreas[i].scrollHeight > maxHeight) {
            maxHeight = textAreas[i].scrollHeight;
        }
    }

    for (let i = 0; i < textAreas.length; i++) {
        textAreas[i].style.height = maxHeight + 5 + "px";
    }
}

function addAutoScale() {
    let textarea = document.querySelectorAll("textarea");
    for (let i = 0; i < textarea.length; i++) {
        textarea[i].addEventListener(
            "input",
            function () {
                autoResize(this);
            },
            false
        );
    }
}

openQuestion();
addAutoScale();

function openRound(button) {
    let roundName;
    if (button.name == "1") {
        roundName = "start";
    } else if (button.name == "2") {
        roundName = "obstacle";
    } else if (button.name == "3") {
        roundName = "acceleration";
    } else if (button.name == "4") {
        roundName = "finish";
    } else {
        roundName = "subFinish";
    }
    openQuestion(roundName);
}

function chooseDb() {
    let dbNumber = Number(document.getElementById("db").value);
    socket.emit("chooseDb", dbNumber);
}

socket.on("_chooseDb", function (dbData) {
    //Start
    for (let i = 1; i <= 5; i++) {
        if (i <= 4) {
            for (let j = 1; j <= 6; j++) {
                let div = document.getElementById("STR" + i + "." + j);
                div.querySelector("textarea.STR_question").value = dbData.startDb[i - 1][j - 1].question;
                div.querySelector("textarea.STR_subject").value = dbData.startDb[i - 1][j - 1].subject;
                div.querySelector("textarea.STR_answer").value = dbData.startDb[i - 1][j - 1].answer;
                div.querySelector("textarea.STR_note").value = dbData.startDb[i - 1][j - 1].note;
                div.querySelector("textarea.STR_media").value = dbData.startDb[i - 1][j - 1].media;
                autoResizeByServer("STR" + i + "." + j);
            }
        } else {
            for (let j = 1; j <= 12; j++) {
                let div = document.getElementById("STR" + i + "." + j);
                div.querySelector("textarea.STR_question").value = dbData.startDb[i - 1][j - 1].question;
                div.querySelector("textarea.STR_subject").value = dbData.startDb[i - 1][j - 1].subject;
                div.querySelector("textarea.STR_answer").value = dbData.startDb[i - 1][j - 1].answer;
                div.querySelector("textarea.STR_note").value = dbData.startDb[i - 1][j - 1].note;
                div.querySelector("textarea.STR_media").value = dbData.startDb[i - 1][j - 1].media;
                autoResizeByServer("STR" + i + "." + j);
            }
        }
    }
    //Obstacle
    document.getElementById("OBS_CNV").value = dbData.obstacleCNV.answer;
    document.getElementById("OBS_image").src = dbData.obstacleCNV.media;
    document.getElementById("OBS_imageUrl").value = dbData.obstacleCNV.media;
    for (let i = 1; i <= 5; i++) {
        let div = document.getElementById("OBS_row" + i);
        div.querySelector("textarea.OBS_question").value = dbData.obstacleDb[i - 1].question;
        div.querySelector("textarea.OBS_answer").value = dbData.obstacleDb[i - 1].answer;
        div.querySelector("textarea.OBS_note").value = dbData.obstacleDb[i - 1].note;
        div.querySelector("textarea.OBS_media").media = dbData.obstacleDb[i - 1].media;
        autoResizeByServer("OBS_row" + i);
        if (i < 5) {
            document.getElementById("OBS_startPos" + i).value = dbData.obstacleDb[i - 1].startPos;
            document.getElementById("OBS_rcmPos" + i).innerHTML = Math.floor((18 - dbData.obstacleDb[i - 1].rowLength) / 2 + 1);
            OBS_checkLegitStartPos(dbData.obstacleDb[i - 1].rowLength, dbData.obstacleDb[i - 1].startPos, i, 1);
        }
    }
    //Acceleration
    for (let i = 1; i <= 4; i++) {
        let div = document.getElementById("ACC" + i);
        div.querySelector("textarea.ACC_question").value = dbData.accelerationDb[i - 1].question;
        div.querySelector("textarea.ACC_answer").value = dbData.accelerationDb[i - 1].answer;
        div.querySelector("textarea.ACC_mediatype").value = dbData.accelerationDb[i - 1].type;
        div.querySelector("textarea.ACC_note").value = dbData.accelerationDb[i - 1].note;
        div.querySelector("textarea.ACC_media").value = dbData.accelerationDb[i - 1].source;
        div.querySelector("textarea.ACC_answerImage").value = dbData.accelerationDb[i - 1].answerImage;
        autoResizeByServer("ACC" + i);
    }
    //Finish
    for (let i = 1; i <= 4; i++) {
        for (let j = 1; j <= 6; j++) {
            let div = document.getElementById("FIN" + i + "." + j);
            div.querySelector("textarea.FIN_question").value = dbData.finishDb[i - 1][j - 1].question;
            div.querySelector("textarea.FIN_answer").value = dbData.finishDb[i - 1][j - 1].answer;
            div.querySelector("textarea.FIN_note").value = dbData.finishDb[i - 1][j - 1].note;
            div.querySelector("textarea.FIN_media").value = dbData.finishDb[i - 1][j - 1].media;
            autoResizeByServer("FIN" + i + "." + j);
        }
    }
    //Sub Finish
    for (let i = 1; i <= 3; i++) {
        let div = document.getElementById("SFI" + i);
        div.querySelector("textarea.SFI_question").value = dbData.subFinishDb[i - 1].question;
        div.querySelector("textarea.SFI_answer").value = dbData.subFinishDb[i - 1].answer;
        div.querySelector("textarea.SFI_note").value = dbData.subFinishDb[i - 1].note;
        div.querySelector("textarea.SFI_media").value = dbData.subFinishDb[i - 1].media;
        autoResizeByServer("SFI" + i);
    }
});

function updateData() {
    if (
        confirm("Bạn có chắc chắn với thao tác cập nhật dữ liệu chưa? Sau khi bạn ấn OK, dữ liệu sẽ bị thay đổi. Vui lòng sao lưu dữ liệu trước để tránh sự cố mất mát")
    ) {
        let data = [];
        let dbNumber = document.getElementById("db").value;
        //Start
        let strData = [];
        for (let i = 0; i < 5; i++) {
            let temp = [];
            if (i < 4) {
                for (let j = 0; j < 6; j++) {
                    temp[j] = {};
                    let dad = document.getElementById("STR" + (i + 1) + "." + (j + 1));
                    temp[j].subject = dad.querySelector(".STR_subject").value;
                    temp[j].question = dad.querySelector(".STR_question").value;
                    temp[j].answer = dad.querySelector(".STR_answer").value;
                    temp[j].note = dad.querySelector(".STR_note").value;
                    temp[j].media = dad.querySelector(".STR_media").value;
                }
            } else {
                for (let j = 0; j < 12; j++) {
                    temp[j] = {};
                    let dad = document.getElementById("STR" + (i + 1) + "." + (j + 1));
                    temp[j].subject = dad.querySelector(".STR_subject").value;
                    temp[j].question = dad.querySelector(".STR_question").value;
                    temp[j].answer = dad.querySelector(".STR_answer").value;
                    temp[j].note = dad.querySelector(".STR_note").value;
                    temp[j].media = dad.querySelector(".STR_media").value;
                }
            }
            strData.push(temp);
        }
        data.push(strData);
        //Obstacle
        let obsData = {};
        obsData.CNV = document.getElementById("OBS_CNV").value;
        obsData.imageUrl = document.getElementById("OBS_imageUrl").value;
        obsData.row = [];
        for (let i = 0; i < 5; i++) {
            obsData.row[i] = {};
            let dad = document.getElementById("OBS_row" + (i + 1));
            obsData.row[i].question = dad.querySelector(".OBS_question").value;
            obsData.row[i].answer = dad.querySelector(".OBS_answer").value;
            obsData.row[i].note = dad.querySelector(".OBS_note").value;
            obsData.row[i].media = dad.querySelector(".OBS_media").value;
            if (i < 4) obsData.row[i].startPos = document.getElementById("OBS_startPos" + (i + 1)).value;
        }
        data.push(obsData);
        //Acceleration
        let accData = [];
        for (let i = 0; i < 4; i++) {
            accData[i] = {};
            let dad = document.getElementById("ACC" + (i + 1));
            accData[i].question = dad.querySelector(".ACC_question").value;
            accData[i].answer = dad.querySelector(".ACC_answer").value;
            accData[i].type = dad.querySelector(".ACC_mediatype").value;
            accData[i].note = dad.querySelector(".ACC_note").value;
            accData[i].media = dad.querySelector(".ACC_media").value;
            accData[i].answerImage = dad.querySelector(".ACC_answerImage").value;
        }
        data.push(accData);
        //Finish
        let finData = [];
        for (let i = 0; i < 4; i++) {
            let temp = [];
            for (let j = 0; j < 6; j++) {
                temp[j] = {};
                let dad = document.getElementById("FIN" + (i + 1) + "." + (j + 1));
                temp[j].question = dad.querySelector(".FIN_question").value;
                temp[j].answer = dad.querySelector(".FIN_answer").value;
                temp[j].note = dad.querySelector(".FIN_note").value;
                temp[j].media = dad.querySelector(".FIN_media").value;
            }
            finData.push(temp);
        }
        data.push(finData);
        //Sub Finish
        let sfiData = [];
        for (let i = 0; i < 3; i++) {
            sfiData[i] = {};
            let dad = document.getElementById("SFI" + (i + 1));
            sfiData[i].question = dad.querySelector(".SFI_question").value;
            sfiData[i].answer = dad.querySelector(".SFI_answer").value;
            sfiData[i].note = dad.querySelector(".SFI_note").value;
            sfiData[i].media = dad.querySelector(".SFI_media").value;
        }
        data.push(sfiData);
        socket.emit("updateData", { data, dbNumber });
    }
}

var slider = document.getElementById("simulator");
var label = document.getElementById("sliderValue");
slider.oninput = function () {
    for (let i = 1; i <= 5; i++) {
        document.getElementById("OBS_hider" + i).style.opacity = 1 - this.value;
    }
    label.innerHTML = "Độ trong suốt mô phỏng tấm che: " + (this.value * 100).toFixed(0) + "%";
};
