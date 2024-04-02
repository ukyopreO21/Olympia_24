//Tạo server
const express = require("express");
const multer = require("multer");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const path = require("path");
const fs = require("fs").promises;
const os = require("os");
const readXlsxFile = require("read-excel-file/node");
const XlsxPopulate = require("xlsx-populate");

var appVersion;
var ipv4Addresses = [];
var adminPassword;

async function getAdminPassword() {
    const min = 100000;
    const max = 999999;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function readPackageJson() {
    try {
        const data = await fs.readFile("package.json");
        const package = JSON.parse(data);
        appVersion = "v" + package.version;
    } catch (err) {
        console.error(err);
    }
}

const networkInterfaces = os.networkInterfaces();

Object.keys(networkInterfaces).forEach((interfaceName) => {
    const interfaceData = networkInterfaces[interfaceName];
    interfaceData.forEach((interfaceInfo) => {
        if (interfaceInfo.family === "IPv4" && !interfaceInfo.internal) {
            ipv4Addresses.push(interfaceInfo.address);
        }
    });
});

async function startServer() {
    await readPackageJson();
    adminPassword = await getAdminPassword();
    console.clear();
    console.log("-----------------------------------------");
    try {
        const data = await fs.readFile("Port.txt", { encoding: "utf-8" });
        const PORT = parseInt(data.trim(), 10);

        if (isNaN(PORT)) {
            console.error("Port không phải là số, vui lòng kiểm tra lại:", data);
            return;
        }

        server.listen(PORT, () => {
            setTimeout(function () {
                io.emit("serverRestarted");
            }, 1000);
            console.log("Phiên bản hiện tại:", "\x1b[91m\x1b[1m", appVersion, "\x1b[0m");
            console.log("\x1b[91m\x1b[1m" + "ĐÂY LÀ SERVER, KHÔNG ĐƯỢC TẮT CMD NÀY CHO TỚI KHI KHÔNG MỞ SERVER NỮA", "\x1b[0m");
            console.log("Danh sách địa chỉ IP của server:", "\x1b[1m", ipv4Addresses, "\x1b[0m");
            console.log("Server đã được mở tại cổng: \x1b[33m\x1b[1m", PORT);
            console.log("Hãy đảm bảo các user kết nối đều sử dụng chung một mạng để có thể kết nối đến một trong những địa chỉ IP trên", "\x1b[0m");
            console.log("Mật khẩu cho trang điều khiển và cơ sở dữ liệu: \x1b[96m%s\x1b[1m", adminPassword, "\x1b[0m");
            console.log("Truy cập các đường liên kết của ứng dụng bằng \x1b[36m%s\x1b[1m", "[Địa chỉ IP của máy này]:" + PORT, "\x1b[0m");
            console.log("Thí sinh: /\nĐiểm: /point\nKĩ thuật: /admin\nNgười xem: /viewer\nTrình chiếu đồ hoạ nền xanh: /live\nCơ sở dữ liệu: /database\nMC: /mc");
            console.log("Gõ lệnh 'rs' để có thể restart lại server");
            console.log("Vui lòng nhấn tổ hợp phím 'Control + C' để tắt server trước khi tắt CMD này.");
            console.log("-----------------------------------------");
        });
    } catch (err) {
        console.error("Lỗi không thể đọc file Port.txt:", err);
        console.log("-----------------------------------------");
    }
}

startServer();

//Quản lý đề và slot
var databaseChosen = 1;
var validSlot = [true, true, true, true];
var isReady = [false, false, false, false];
var userID = ["", "", "", ""];
var playerName = ["", "", "", ""];
var playerPoint = [0, 0, 0, 0];
var disconnectTimes = [];
var chatLog = [];

//Ghi database

function updateData(data) {
    let dbNumber = data.dbNumber;
    XlsxPopulate.fromFileAsync("./Database/Database" + dbNumber + ".xlsx").then((workbook) => {
        let sheetNames = ["Start", "Obstacle", "Acceleration", "Finish", "Sub Finish"];
        for (let i = 0; i < sheetNames.length; i++) {
            let sheet = workbook.sheet(sheetNames[i]);
            if (i == 0) {
                for (let p = 0; p < 5; p++) {
                    if (p < 4) {
                        for (let q = 0; q < 6; q++) {
                            sheet.cell("C" + (2 + 6 * p + q)).value(data.data[i][p][q].subject);
                            sheet.cell("D" + (2 + 6 * p + q)).value(data.data[i][p][q].question);
                            sheet.cell("E" + (2 + 6 * p + q)).value(data.data[i][p][q].answer);
                            sheet.cell("F" + (2 + 6 * p + q)).value(data.data[i][p][q].note);
                            sheet.cell("G" + (2 + 6 * p + q)).value(data.data[i][p][q].media);
                        }
                    } else {
                        for (let q = 0; q < 12; q++) {
                            sheet.cell("C" + (2 + 6 * p + q)).value(data.data[i][p][q].subject);
                            sheet.cell("D" + (2 + 6 * p + q)).value(data.data[i][p][q].question);
                            sheet.cell("E" + (2 + 6 * p + q)).value(data.data[i][p][q].answer);
                            sheet.cell("F" + (2 + 6 * p + q)).value(data.data[i][p][q].note);
                            sheet.cell("G" + (2 + 6 * p + q)).value(data.data[i][p][q].media);
                        }
                    }
                }
            } else if (i == 1) {
                for (let q = 0; q < 5; q++) {
                    sheet.cell("C" + (q + 2)).value(data.data[i].row[q].question);
                    sheet.cell("D" + (q + 2)).value(data.data[i].row[q].answer);
                    sheet.cell("E" + (q + 2)).value(data.data[i].row[q].note);
                    sheet.cell("F" + (q + 2)).value(data.data[i].row[q].media);
                    if (q < 4) sheet.cell("B" + (11 + q)).value(data.data[i].row[q].startPos);
                }
                sheet.cell("D7").value(data.data[i].CNV);
                sheet.cell("F7").value(data.data[i].imageUrl);
            } else if (i == 2) {
                for (let q = 0; q < 4; q++) {
                    sheet.cell("B" + (q + 2)).value(data.data[i][q].question);
                    sheet.cell("C" + (q + 2)).value(data.data[i][q].answer);
                    sheet.cell("D" + (q + 2)).value(data.data[i][q].type);
                    sheet.cell("E" + (q + 2)).value(data.data[i][q].note);
                    sheet.cell("F" + (q + 2)).value(data.data[i][q].media);
                    sheet.cell("G" + (q + 2)).value(data.data[i][q].answerImage);
                }
            } else if (i == 3) {
                for (let p = 0; p < 4; p++) {
                    for (let q = 0; q < 6; q++) {
                        sheet.cell("C" + (2 + 6 * p + q)).value(data.data[i][p][q].question);
                        sheet.cell("D" + (2 + 6 * p + q)).value(data.data[i][p][q].answer);
                        sheet.cell("E" + (2 + 6 * p + q)).value(data.data[i][p][q].note);
                        sheet.cell("F" + (2 + 6 * p + q)).value(data.data[i][p][q].media);
                    }
                }
            } else {
                for (let q = 0; q < 3; q++) {
                    sheet.cell("B" + (q + 2)).value(data.data[i][q].question);
                    sheet.cell("C" + (q + 2)).value(data.data[i][q].answer);
                    sheet.cell("D" + (q + 2)).value(data.data[i][q].note);
                    sheet.cell("E" + (q + 2)).value(data.data[i][q].media);
                }
            }
        }
        return workbook.toFileAsync("./Database/Database" + dbNumber + ".xlsx");
    });
}

function saveMatchData(dbNumber) {
    XlsxPopulate.fromFileAsync("./Database/Database" + dbNumber + ".xlsx").then((workbook) => {
        for (let i = 0; i < 4; i++) {
            workbook
                .sheet("Match Data")
                .cell("B" + (2 + i))
                .value(playerName[i]);
            workbook
                .sheet("Match Data")
                .cell("G" + (2 + i))
                .value(playerPoint[i]);
        }
        return workbook.toFileAsync("./Database/Database" + dbNumber + ".xlsx");
    });
}

//DATABASE

async function readDatabase(path, isReadBase64) {
    let startDb = [];
    let obstacleDb = [];
    let obstacleCNV = {};
    let accelerationDb = [];
    let finishDb = [];
    let subFinishDb = [];
    let matchDataDb = [];

    await readXlsxFile(path, { sheet: "Start" }).then((Database) => {
        for (let i = 0; i < 5; i++) {
            temp = [];
            if (i < 4) {
                for (let j = 0; j < 6; j++) {
                    temp[j] = {
                        subject: Database[6 * i + j + 1][2],
                        question: Database[6 * i + j + 1][3],
                        answer: Database[6 * i + j + 1][4],
                        note: Database[6 * i + j + 1][5],
                        media: Database[6 * i + j + 1][6],
                    };
                }
            } else {
                for (let j = 0; j < 12; j++) {
                    temp[j] = {
                        subject: Database[6 * i + j + 1][2],
                        question: Database[6 * i + j + 1][3],
                        answer: Database[6 * i + j + 1][4],
                        note: Database[6 * i + j + 1][5],
                        media: Database[6 * i + j + 1][6],
                    };
                }
            }

            startDb.push(temp);
        }
    });

    await readXlsxFile(path, { sheet: "Obstacle" }).then((Database) => {
        for (let i = 0; i < 5; i++) {
            obstacleDb[i] = {
                rowLength: Database[i + 1][1],
                question: Database[i + 1][2],
                answer: Database[i + 1][3],
                note: Database[i + 1][4],
                media: Database[i + 1][5],
            };
            if (obstacleDb[i].rowLength == null) {
                if (obstacleDb[i].answer == null) obstacleDb[i].rowLength = 0;
                else obstacleDb[i].rowLength = String(obstacleDb[i].answer).replace(/\s/g, "").length;
            }
            if (i < 4) {
                obstacleDb[i].startPos = Database[i + 10][1];
            }
        }
        obstacleCNV.answer = Database[6][3];
        obstacleCNV.note = Database[6][4];
        obstacleCNV.media = Database[6][5];
    });

    if (!isReadBase64) {
        await readXlsxFile(path, { sheet: "Acceleration" }).then((Database) => {
            for (let i = 0; i < 4; i++) {
                accelerationDb[i] = {
                    question: Database[i + 1][1],
                    answer: Database[i + 1][2],
                    type: Database[i + 1][3],
                    note: Database[i + 1][4],
                    source: Database[i + 1][5],
                    answerImage: Database[i + 1][6],
                };
            }
        });
    } else {
        const Database = await readXlsxFile(path, { sheet: "Acceleration" });
        for (let i = 0; i < 4; i++) {
            accelerationDb[i] = {
                question: Database[i + 1][1],
                answer: Database[i + 1][2],
                type: Database[i + 1][3],
                note: Database[i + 1][4],
            };

            if (accelerationDb[i].type == "Video") {
                let videoSource = "./public" + Database[i + 1][5].slice(1);
                try {
                    const base64String = "data:video/mp4;base64," + (await ACC_base64Video(videoSource));
                    accelerationDb[i].source = base64String;
                } catch (error) {
                    console.error("Lỗi: Không thể mã hoá base64 video tăng tốc số " + (i + 1));
                }
            } else {
                accelerationDb[i].source = Database[i + 1][5];
            }
            accelerationDb[i].answerImage = Database[i + 1][6];
        }
    }

    await readXlsxFile(path, { sheet: "Finish" }).then((Database) => {
        for (let i = 0; i < 4; i++) {
            temp = [];
            for (let j = 0; j < 6; j++) {
                temp[j] = {
                    point: Database[6 * i + j + 1][1],
                    question: Database[6 * i + j + 1][2],
                    answer: Database[6 * i + j + 1][3],
                    note: Database[6 * i + j + 1][4],
                    media: Database[6 * i + j + 1][5],
                };
            }
            finishDb.push(temp);
        }
    });

    await readXlsxFile(path, { sheet: "Sub Finish" }).then((Database) => {
        for (let i = 0; i < 3; i++) {
            subFinishDb[i] = {
                question: Database[i + 1][1],
                answer: Database[i + 1][2],
                note: Database[i + 1][3],
                media: Database[i + 1][4],
            };
        }
    });

    await readXlsxFile(path, { sheet: "Match Data" }).then((Database) => {
        for (let i = 0; i < 4; i++) {
            matchDataDb[i] = {
                name: Database[i + 1][1],
                totalPoint: Database[i + 1][6],
            };
        }
    });

    return {
        startDb,
        obstacleDb,
        obstacleCNV,
        accelerationDb,
        finishDb,
        subFinishDb,
        matchDataDb,
    };
}

var STR_QnA = [];
var OBS_QnA = [];
var OBS_CNV;
var ACC_QnA = [];
var FIN_QnA = [];
var SFI_QnA = [];

async function setData(dbNumber) {
    let matchData = await readDatabase("./Database/Database" + dbNumber + ".xlsx", 1);
    STR_QnA = matchData.startDb;
    OBS_QnA = matchData.obstacleDb;
    OBS_CNV = matchData.obstacleCNV;
    ACC_QnA = matchData.accelerationDb;
    FIN_QnA = matchData.finishDb;
    SFI_QnA = matchData.subFinishDb;
    for (let i = 0; i < 4; i++) {
        playerName[i] = matchData.matchDataDb[i].name;
        playerPoint[i] = matchData.matchDataDb[i].totalPoint;
    }
    io.emit("playerDataFromDatabase", { playerName, playerPoint });
}

async function getData(dbNumber) {
    let data = await readDatabase("./Database/Database" + dbNumber + ".xlsx", 0);
    return data;
}

setData(1);

var playerGranted = 0;
var STR_ithQuestion;
var OBS_numberOfObsSignal = 0;
var ACC_currentQuestion;
var ACC_startTime;
var FIN_currentPlayer;
var FIN_questionPos = ["", "", ""];
var SFI_openedQuestion;

function STR_getNextQuestion(ithStart) {
    STR_ithQuestion++;
    return STR_QnA[ithStart - 1][STR_ithQuestion];
}

async function ACC_base64Video(filePath) {
    try {
        const data = await fs.readFile(filePath);
        return Buffer.from(data).toString("base64");
    } catch (error) {
        throw error;
    }
}

function FIN_getQuestion(i) {
    if (FIN_questionPos[i - 1].point == 20) return FIN_QnA[FIN_currentPlayer - 1][FIN_questionPos[i - 1].pos];
    else return FIN_QnA[FIN_currentPlayer - 1][3 + FIN_questionPos[i - 1].pos];
}

function SFI_getQuestion(i) {
    return SFI_QnA[i - 1];
}

function SFI_countOpened() {
    var count = 0;
    for (i = 0; i < 3; i++) if (SFI_openedQuestion[i]) count++;
    return count;
}

function formatTime(date) {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();

    // Đảm bảo hiển thị 2 chữ số cho giờ, phút, giây
    hours = (hours < 10 ? "0" : "") + hours;
    minutes = (minutes < 10 ? "0" : "") + minutes;
    seconds = (seconds < 10 ? "0" : "") + seconds;

    // Trả về định dạng hh:mm:ss
    return hours + ":" + minutes + ":" + seconds;
}

//Tín hiệu
io.on("connection", function (socket) {
    //Lấy version
    socket.on("getVersion", function () {
        socket.emit("_getVersion", appVersion);
    });

    //login admin
    socket.on("sendAdminPassword", function (password) {
        if (Number(password) == adminPassword) socket.emit("_sendAdminPassword", password);
    });

    //Set database
    socket.on("adminChooseDb", function (dbNumber) {
        databaseChosen = dbNumber;
        setData(dbNumber);
        console.log("Đề thi đã được chọn là database " + dbNumber);
    });
    //Gửi database
    socket.on("chooseDb", async function (dbNumber) {
        let data = await getData(dbNumber);
        socket.emit("_chooseDb", data);
    });

    //Nhận update
    socket.on("updateData", function (data) {
        updateData(data);
    });

    //Xử lý đăng nhập
    socket.on("connecting", function () {
        socket.emit("sendSlot", { validSlot, playerName });
    });

    socket.on("signIn", function (slot) {
        //from slot/main web
        if (validSlot[slot - 1]) {
            socket.emit("_signIn", { check: true, slot });
            validSlot[slot - 1] = false;
            io.emit("sendSlot", { validSlot, playerName });
        } else socket.emit("_signIn", false);
    });

    socket.on("_firstLogIn", function (data) {
        //from force player web
        userID[data.playerNumber - 1] = data.userID;
        validSlot[data.playerNumber - 1] = false;
    });

    socket.on("legitLogIn", function (playerNumber) {
        clearInterval(disconnectTimes[playerNumber - 1]);
        socket.emit("_playerEnterRoom");
        socket.emit("sendPlayersData", { playerName, playerPoint, isReady });
        socket.emit("_getVersion", appVersion);
        socket.emit("sendChatLog", chatLog);
        io.emit("getCurrentUI");
        console.log("Player " + playerNumber + " entered the room.");
    });

    socket.on("playerEnterRoom", function (playerNumber) {
        if (!validSlot[playerNumber - 1] && userID[playerNumber - 1] != "") {
            //login from slot/main
            socket.emit("checkLogIn", userID[playerNumber - 1]);
        } else {
            //login force from player or userID is empty
            socket.emit("firstLogIn");
        }
    });

    socket.on("hostEnterRoom", function () {
        socket.emit("serverData", { playerName, playerPoint, isReady, databaseChosen });
        socket.emit("_getVersion", appVersion);
        socket.emit("sendChatLog");
    });

    socket.on("signOut", function (playerNumber) {
        let count = 0;
        clearInterval(disconnectTimes[playerNumber - 1]);
        disconnectTimes[playerNumber - 1] = setInterval(function () {
            if (count == 5) {
                validSlot[playerNumber - 1] = true;
                userID[playerNumber - 1] = "";
                io.emit("sendSlot", { validSlot, playerName });
                clearInterval(disconnectTimes[playerNumber - 1]);
            }
            count++;
        }, 1000);
    });

    //CHAT
    socket.on("sendChat", function (dataUser) {
        let time = new Date();
        time = formatTime(time);
        let message = dataUser.message;
        let username = dataUser.username;
        if (dataUser.playerNumber != 0) username = playerName[dataUser.playerNumber - 1] + dataUser.username;
        chatLog.push({
            time: time,
            username: username,
            message: dataUser.message,
        });
        io.emit("_sendChat", { username, message, time });
    });

    //Sẵn sàng
    socket.on("sendReady", function (data) {
        isReady[data.playerNumber - 1] = data.ready;
        io.emit("_sendReady", data);
    });

    //CHỌN VÒNG THI
    socket.on("RoundChosen", function (roundID) {
        io.emit("_RoundChosen", roundID);
    });

    //Xử lý CHUẨN BỊ

    socket.on("playIntro", function (roundID) {
        io.emit("_playIntro", roundID);
    });

    socket.on("startRound", function () {
        io.emit("_startRound");
    });

    socket.on("changeChatRules", function (rule) {
        io.emit("_changeChatRules", rule);
    });

    socket.on("ContestUI", function () {
        io.emit("_ContestUI");
    });

    socket.on("ChatUI", function () {
        io.emit("_ChatUI");
    });

    socket.on("mute-all", function () {
        io.emit("_mute-all");
    });

    socket.on("sendCurrentUI", function (UIData) {
        io.emit("_sendCurrentUI", UIData);
    });

    socket.on("resetStatus", function (roundID) {
        io.emit("_resetStatus", roundID);
    });

    //ADMIN DATA
    socket.on("sendAdminData", function (adminData) {
        for (let i = 0; i < 4; i++) {
            playerName[i] = adminData.currentPlayerName[i];
            playerPoint[i] = adminData.currentPlayerPoint[i];
        }
        saveMatchData(databaseChosen);
        io.emit("_sendAdminData", adminData);
    });

    //Xử lý TRONG PHẦN THI
    //KHỞI ĐỘNG

    socket.on("STR_choosePlayer", function (ithStart) {
        io.emit("_STR_choosePlayer", ithStart);
    });

    socket.on("STR_startPlayerTurn", function () {
        io.emit("_STR_startPlayerTurn");
    });

    socket.on("STR_openQuestionBoard", function () {
        io.emit("_STR_openQuestionBoard");
    });

    socket.on("STR_startTurn", function (ithStart) {
        STR_ithQuestion = -1;
        let question = STR_getNextQuestion(Number(ithStart));
        io.emit("_STR_startTurn", question);
    });

    socket.on("STR_getNextQuestion", function (ithStart) {
        let question = STR_getNextQuestion(Number(ithStart));
        io.emit("_STR_getNextQuestion", question);
    });

    socket.on("STR_Timing", function (time) {
        if (time == 3) playerGranted = 0;
        io.emit("_STR_Timing", time);
    });

    socket.on("STR_blockSignal", function (playerNumber) {
        if (!playerGranted) playerGranted = playerNumber;
        io.emit("_STR_blockSignal", playerGranted);
    });

    socket.on("STR_Right", function () {
        io.emit("_STR_Right");
    });

    socket.on("STR_Wrong", function () {
        io.emit("_STR_Wrong");
    });

    socket.on("STR_finishTurn", function () {
        io.emit("_STR_finishTurn");
    });

    //VCNV

    socket.on("OBS_adminGetRoundData", function () {
        io.emit("_OBS_adminGetRoundData", { OBS_CNV, OBS_QnA });
    });

    socket.on("OBS_showNumberOfCharacter", function () {
        io.emit("_OBS_showNumberOfCharacter");
    });

    socket.on("OBS_showRows", function () {
        OBS_numberOfObsSignal = 0;
        io.emit("_OBS_showRows", OBS_CNV);
    });

    socket.on("OBS_getRowsLength", function () {
        io.emit("_OBS_getRowsLength", OBS_QnA);
    });

    socket.on("OBS_chooseRow", function (rowIth) {
        io.emit("_OBS_chooseRow", { rowIth, OBS_QnA });
    });

    socket.on("OBS_showRowQuestion", function (rowIth) {
        io.emit("_OBS_showRowQuestion", OBS_QnA[rowIth - 1]);
    });

    socket.on("OBS_closeRowQuestion", function () {
        io.emit("_OBS_closeRowQuestion");
    });

    socket.on("OBS_start15s", function () {
        io.emit("_OBS_start15s");
    });

    socket.on("sendAnswer", function (answerData) {
        io.emit("_sendAnswer", answerData);
    });

    socket.on("OBS_playerObsSignal", function (playerNumber) {
        OBS_numberOfObsSignal++;
        io.emit("_OBS_playerObsSignal", { playerNumber, OBS_numberOfObsSignal });
    });

    socket.on("OBS_serverObsSignal", function (signalDataFromAdmin) {
        io.emit("_OBS_serverObsSignal", {
            signalDataFromAdmin,
            OBS_numberOfObsSignal,
        });
    });

    socket.on("OBS_showRowAnswer", function (rowAnswerData) {
        io.emit("_OBS_showRowAnswer", rowAnswerData);
    });

    socket.on("OBS_backScreen", function () {
        io.emit("_OBS_backScreen");
    });

    socket.on("OBS_wrongRow", function (numberOfWrongPlayer) {
        io.emit("_OBS_wrongRow", numberOfWrongPlayer);
    });

    socket.on("OBS_playRightRow", function (currentRow) {
        let questionData = OBS_QnA[Number(currentRow) - 1];
        io.emit("_OBS_playRightRow", {
            currentRow,
            questionData,
        });
    });

    socket.on("OBS_playWrongRow", function (currentRow) {
        io.emit("_OBS_playWrongRow", currentRow);
    });

    socket.on("OBS_ImageUI", function () {
        io.emit("_OBS_ImageUI");
    });

    socket.on("OBS_openCorner", function (currentRow) {
        io.emit("_OBS_openCorner", currentRow);
    });

    socket.on("OBS_rightObs", function (value) {
        let CNV = OBS_CNV.answer;
        io.emit("_OBS_rightObs", { CNV, OBS_QnA });
        io.emit("OBS_keepRightObs", value);
    });

    socket.on("OBS_wrongObs", function () {
        OBS_numberOfObsSignal = 0;
        io.emit("_OBS_wrongObs");
    });

    socket.on("OBS_last15s", function () {
        io.emit("_OBS_last15s");
    });

    socket.on("OBS_showObs", function () {
        let CNV = OBS_CNV.answer;
        io.emit("_OBS_showObs", { CNV, OBS_QnA });
    });

    socket.on("result", function () {
        io.emit("_result");
    });

    socket.on("endGame", function () {
        io.emit("_endGame");
    });

    //TĂNG TỐC

    socket.on("ACC_chooseQuestion", function () {
        io.emit("_ACC_chooseQuestion");
    });

    socket.on("ACC_openQuestion", function (ithQuestion) {
        ACC_currentQuestion = Number(ithQuestion);
        io.emit("_ACC_openQuestion", ACC_QnA[ithQuestion - 1]);
        io.emit("ACC_sendQuestionNumber", ithQuestion);
    });

    socket.on("ACC_checkVideoSource", function (playerData) {
        if (playerData.sourceNum == ACC_QnA[ACC_currentQuestion - 1].source.length) {
            console.log("Thí sinh " + playerData.playerNumber + " đã tải thành công video tăng tốc " + ACC_currentQuestion);
            io.emit("_ACC_checkVideoSource", playerData.playerNumber);
        } else console.log("Thí sinh " + playerData.playerNumber + " không thể tải video tăng tốc " + ACC_currentQuestion);
    });

    socket.on("ACC_startTiming", function (ithQuestion) {
        ACC_startTime = Date.now();
        io.emit("_ACC_startTiming", { ithQuestion, ACC_startTime });
    });

    socket.on("ACC_sentAnswer", function (answerData) {
        let catchTime = Date.now() - 2;
        let costTime = (catchTime - ACC_startTime) / 1000;
        if (costTime <= ACC_currentQuestion * 10) {
            costTime = costTime.toFixed(2);
            io.emit("_ACC_sentAnswer", { answerData, costTime });
        }
    });

    socket.on("ACC_showAnswers", function (answerData) {
        io.emit("_ACC_showAnswer", answerData);
    });

    socket.on("ACC_showQuestionAnswer", function (ithQuestion) {
        io.emit("_ACC_showQuestionAnswer", ACC_QnA[ithQuestion - 1]);
    });

    socket.on("ACC_Right", function (answerData) {
        io.emit("_ACC_Right", answerData);
    });

    socket.on("ACC_Wrong", function () {
        io.emit("_ACC_Wrong");
    });

    socket.on("ACC_turnOffQuestion", function () {
        io.emit("_ACC_turnOffQuestion");
    });

    socket.on("ACC_questionScreen", function () {
        io.emit("_ACC_questionScreen");
    });

    socket.on("ACC_answerScreen", function () {
        io.emit("_ACC_answerScreen");
    });

    //VỀ ĐÍCH
    socket.on("FIN_choosePlayer", function (player) {
        FIN_currentPlayer = Number(player);
        io.emit("_FIN_choosePlayer", player);
    });

    socket.on("FIN_showQuestionPack", function () {
        io.emit("_FIN_showQuestionPack");
    });

    socket.on("FIN_Choose", function (chooseData) {
        io.emit("_FIN_Choose", chooseData);
    });

    socket.on("FIN_packChosen", function (list) {
        let FIN_numbersOfQuestion = [0, 0];
        for (i = 0; i < 3; i++) {
            if (Number(list[i]) == 20) {
                FIN_questionPos[i] = {};
                FIN_questionPos[i].point = 20;
                FIN_questionPos[i].pos = FIN_numbersOfQuestion[0];
                FIN_numbersOfQuestion[0]++;
            } else {
                FIN_questionPos[i] = {};
                FIN_questionPos[i].point = 30;
                FIN_questionPos[i].pos = FIN_numbersOfQuestion[1];
                FIN_numbersOfQuestion[1]++;
            }
        }
        io.emit("_FIN_packChosen", list);
    });

    socket.on("FIN_chooseQuestion", function (ithQuestion) {
        var questionData = FIN_getQuestion(Number(ithQuestion));
        io.emit("_FIN_chooseQuestion", { ithQuestion, questionData });
    });

    socket.on("FIN_startTiming", function (questionTime) {
        io.emit("_FIN_startTiming", questionTime);
    });

    socket.on("FIN_Star", function (isStarOn) {
        io.emit("_FIN_Star", isStarOn);
    });

    socket.on("FIN_Right", function () {
        io.emit("_FIN_Right");
    });

    socket.on("FIN_Wrong", function () {
        io.emit("_FIN_Wrong");
    });

    socket.on("FIN_5s", function () {
        playerGranted = 0;
        io.emit("_FIN_5s");
    });

    socket.on("FIN_blockSignal", function (playerNumber) {
        if (!playerGranted) {
            playerGranted = Number(playerNumber);
            io.emit("_FIN_blockSignal", playerNumber);
        }
    });

    socket.on("FIN_finishTurn", function () {
        io.emit("_FIN_finishTurn");
    });

    //CÂU HỎI PHỤ
    socket.on("SFI_chosenPlayer", function (playerNumber) {
        io.emit("_SFI_chosenPlayer", playerNumber);
    });

    socket.on("SFI_startRound", function (playerList) {
        SFI_openedQuestion = new Array(3).fill(false);
        io.emit("_SFI_startRound", playerList);
    });

    socket.on("SFI_openQuestion", function (ithQuestion) {
        SFI_openedQuestion[Number(ithQuestion) - 1] = true;
        var questionData = SFI_getQuestion(Number(ithQuestion));
        var openedCount = SFI_countOpened();
        io.emit("_SFI_openQuestion", { questionData, openedCount });
    });

    socket.on("SFI_closeQuestion", function () {
        io.emit("_SFI_closeQuestion");
    });

    socket.on("SFI_Timing", function (isReset) {
        playerGranted = 0;
        io.emit("_SFI_Timing", isReset);
    });

    socket.on("SFI_Right", function () {
        io.emit("_SFI_Right");
    });

    socket.on("SFI_blockSignal", function (playerNumber) {
        if (!playerGranted) {
            playerGranted = Number(playerNumber);
            io.emit("_SFI_blockSignal", playerNumber);
        }
    });

    socket.on("SFI_blockButton", function () {
        io.emit("_SFI_blockButton");
    });

    socket.on("getPlayerData", function (playerNumber) {
        let data = {};
        data.name = playerName[Number(playerNumber) - 1];
        data.point = playerPoint[Number(playerNumber) - 1];
        socket.emit("_getPlayerData", data);
    });

    socket.on("OUT_introVideo", function () {
        io.emit("_OUT_introVideo");
    });

    socket.on("OUT_introAudio", function () {
        io.emit("_OUT_introAudio");
    });

    socket.on("OUT_MC", function () {
        io.emit("_OUT_MC");
    });

    socket.on("OUT_Player", function () {
        io.emit("_OUT_Player");
    });

    socket.on("OUT_Introduce", function (num) {
        io.emit("_OUT_Introduce", num);
    });

    socket.on("OUT_Flower", function (num) {
        io.emit("_OUT_Flower", num);
    });

    socket.on("OUT_Ambience", function () {
        io.emit("_OUT_Ambience");
    });

    socket.on("OUT_Result", function (num) {
        io.emit("_OUT_Result", num);
    });

    socket.on("OUT_Prize", function (num) {
        io.emit("_OUT_Prize", num);
    });

    socket.on("OUT_closeAllAudio", function () {
        io.emit("_OUT_closeAllAudio");
    });
});

app.use(express.static("public"));

const upload = multer({ storage: multer.memoryStorage() });

app.post("/database", upload.single("file"), async (req, res) => {
    try {
        let filePath = req.file.buffer;
        let data = await readDatabase(filePath, 0);
        io.emit("_chooseDb", data);
        res.send("File đã được server đọc và gửi dữ liệu trả về.");
    } catch (error) {
        console.error(error);
        res.status(500).send("Có lỗi xảy ra khi đọc dữ liệu từ file.");
    }
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/temp/");
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
    },
});

const uploadMedia = multer({ storage: storage });

app.post("/uploadMedia", uploadMedia.any(), (req, res) => {
    let mediaType = String(req.files[0].mimetype).substring(0, 5);
    let time = formatTime(new Date());
    let mediaUrl = "./temp/" + req.files[0].filename;
    let userData = JSON.parse(req.body.userData);
    let username = userData.username;
    if (userData.playerNumber != 0) username = playerName[userData.playerNumber - 1] + userData.username;
    chatLog.push({
        time: time,
        mediaUrl: mediaUrl,
        mediaType: mediaType,
        username: username,
    });
    io.emit("_sendChat", { mediaUrl, mediaType, username, time });
});

app.get("/", function (req, res) {
    res.sendFile("slot.html", { root: __dirname + "/public" });
});

app.get("/admin", function (req, res) {
    res.sendFile("admin.html", { root: __dirname + "/public" });
});

app.get("/player", function (req, res) {
    res.sendFile("player.html", {
        root: __dirname + "/public",
    });
});

app.get("/point", function (req, res) {
    res.sendFile("point.html", {
        root: __dirname + "/public",
    });
});

app.get("/viewer", function (req, res) {
    res.sendFile("viewer.html", {
        root: __dirname + "/public",
    });
});

app.get("/live", function (req, res) {
    res.sendFile("live.html", {
        root: __dirname + "/public",
    });
});

app.get("/database", function (req, res) {
    res.sendFile("database.html", {
        root: __dirname + "/public",
    });
});

app.get("/mc", function (req, res) {
    res.sendFile("mc.html", {
        root: __dirname + "/public",
    });
});
