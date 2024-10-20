export const handle = () => {
    window.addEventListener("resize", () => resize(0));
    window.openRound = openRound;
    window.updateImage = updateImage;

    const slider = document.getElementById("simulator");
    const label = document.getElementById("slider-value");
    slider.oninput = () => {
        const hiders = document.querySelectorAll(".OBS_hider");
        hiders.forEach((hider) => {
            hider.style.opacity = 1 - slider.value;
        });
        label.innerHTML = "Độ trong suốt mô phỏng tấm che: " + (slider.value * 100).toFixed(0) + "%";
    };

    OBS_listenRowsLength();
    openQuestions();
    addAutoScale();
};

const OBS_listenRowsLength = async () => {
    await markId();
    for (let i = 1; i <= 4; i++) {
        document.getElementById("OBS_start-pos-" + i).addEventListener("blur", (event) => {
            const name = event.target.name;
            const pos = Number(document.getElementById(event.target.id).value.replace(/\s/g, ""));
            document.getElementById(event.target.id).value = pos;
            const rowLength = document.querySelector("#OBS_row" + name + " .OBS_answer").value.replace(/\s/g, "").length;
            OBS_checkLegitStartPos(rowLength, pos, name);
        });

        document.querySelector("#OBS_row" + i + " .OBS_answer").addEventListener("keyup", (event) => {
            const name = event.target.name;
            const length = document.querySelector("#OBS_row" + name + " .OBS_answer").value.replace(/\s/g, "").length;
            const rcmPos = Math.floor((18 - length) / 2 + 1);
            const currentPos = Number(document.getElementById("OBS_start-pos-" + name).value.replace(/\s/g, ""));
            document.getElementById("OBS_recommend-pos-" + name).innerHTML = rcmPos;
            OBS_checkLegitStartPos(length, currentPos, name);
        });
    }
};

export const OBS_checkLegitStartPos = (rowLength, pos, name) => {
    if (rowLength > 0 && rowLength + Number(pos) - 1 <= 18 && pos > 0) document.getElementById("OBS_result-pos-" + name).innerHTML = "<font color='white'>Hợp lệ</font>";
    else document.getElementById("OBS_result-pos-" + name).innerHTML = "<font color='#FF6961'>Không hợp lệ</font>";
};

const resize = (type, round) => {
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
};

const updateImage = () => {
    document.getElementById("OBS_image").src = document.getElementById("OBS_image-url").value;
};

const openQuestions = (roundName) => {
    const dad = document.querySelectorAll(".round");
    for (let i = 0; i < dad.length; i++) {
        if (dad[i].id != roundName) dad[i].style.display = "none";
        else {
            dad[i].style.display = "block";
            resize(1, i);
        }
    }
};

const markId = async () => {
    const strDiv = document.querySelectorAll("#start div");
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

    const obsDiv = document.querySelectorAll(".OBS_row");
    for (let i = 0; i < obsDiv.length; i++) obsDiv[i].id = "OBS_row" + (i + 1);

    const accDiv = document.querySelectorAll("#acceleration div");
    for (let i = 0; i < accDiv.length; i++) accDiv[i].id = "ACC" + (i + 1);

    const finDiv = document.querySelectorAll("#finish div");
    for (let i = 1; i <= 4; i++) {
        for (let j = 0; j < finDiv.length / 4; j++) {
            finDiv[6 * (i - 1) + j].id = "FIN" + i + "." + (j + 1);
        }
    }

    const subFinishDiv = document.querySelectorAll("#sub-finish div");
    for (let i = 0; i < subFinishDiv.length; i++) subFinishDiv[i].id = "SFI" + (i + 1);
};

export const autoResizeByServer = async (currentDadId) => {
    const div = document.getElementById(currentDadId);
    const textAreas = div.querySelectorAll("textarea");

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
};

const autoResize = (textarea) => {
    const div = textarea.parentNode;
    const textAreas = div.querySelectorAll("textarea");

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
};

const addAutoScale = () => {
    const textarea = document.querySelectorAll("textarea");
    for (let i = 0; i < textarea.length; i++) {
        textarea[i].addEventListener("input", () => autoResize(textarea[i]), false);
    }
};

const openRound = (button) => {
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
        roundName = "sub-finish";
    }
    openQuestions(roundName);
};
