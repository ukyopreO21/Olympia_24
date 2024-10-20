const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs").promises;
const XlsxPopulate = require("xlsx-populate");

const router = express.Router();
const uploadDatabase = multer({ storage: multer.memoryStorage() });
const databaseData = { STR: [], OBS: [], ACC: [], FIN: [], SFI: [] };

const handle = (io, socket) => {
    socket.on("updateData", (data) => {
        update(data);
    });

    router.post("/database", uploadDatabase.single("file"), async (req, res) => {
        try {
            const filePath = req.file.buffer;
            const data = await read(filePath, 0);
            io.emit("_chooseDb", data);
            res.send("File đã được server đọc và gửi dữ liệu trả về.");
        } catch (error) {
            console.error(error);
            res.status(500).send("Có lỗi xảy ra khi đọc dữ liệu từ file.");
        }
    });
};

const update = (data) => {
    const dbNumber = data.dbNumber;
    XlsxPopulate.fromFileAsync(path.join(__dirname, "/xlsx/main/database" + dbNumber + ".xlsx")).then((workbook) => {
        const sheetNames = ["Start", "Obstacle", "Acceleration", "Finish", "Sub Finish"];
        for (let i = 0; i < sheetNames.length; i++) {
            const sheet = workbook.sheet(sheetNames[i]);
            if (i == 0) {
                for (let p = 0; p < 5; p++) {
                    if (p < 4) {
                        for (let q = 0; q < 6; q++) {
                            sheet.cell("C" + (2 + 6 * p + q)).value(data.data[i][p][q].subject);
                            sheet.cell("D" + (2 + 6 * p + q)).value(data.data[i][p][q].question);
                            sheet.cell("E" + (2 + 6 * p + q)).value(data.data[i][p][q].answer);
                            sheet.cell("F" + (2 + 6 * p + q)).value(data.data[i][p][q].note);
                            sheet.cell("G" + (2 + 6 * p + q)).value(data.data[i][p][q].mediaUrl);
                        }
                    } else {
                        for (let q = 0; q < 12; q++) {
                            sheet.cell("C" + (2 + 6 * p + q)).value(data.data[i][p][q].subject);
                            sheet.cell("D" + (2 + 6 * p + q)).value(data.data[i][p][q].question);
                            sheet.cell("E" + (2 + 6 * p + q)).value(data.data[i][p][q].answer);
                            sheet.cell("F" + (2 + 6 * p + q)).value(data.data[i][p][q].note);
                            sheet.cell("G" + (2 + 6 * p + q)).value(data.data[i][p][q].mediaUrl);
                        }
                    }
                }
            } else if (i == 1) {
                for (let q = 0; q < 5; q++) {
                    sheet.cell("C" + (q + 2)).value(data.data[i][q].question);
                    sheet.cell("D" + (q + 2)).value(data.data[i][q].answer);
                    sheet.cell("E" + (q + 2)).value(data.data[i][q].note);
                    sheet.cell("F" + (q + 2)).value(data.data[i][q].mediaUrl);
                    if (q < 4) sheet.cell("B" + (11 + q)).value(data.data[i][q].startPos);
                }
                sheet.cell("D7").value(data.data[i][5].answer);
                sheet.cell("F7").value(data.data[i][5].mediaUrl);
            } else if (i == 2) {
                for (let q = 0; q < 4; q++) {
                    sheet.cell("B" + (q + 2)).value(data.data[i][q].question);
                    sheet.cell("C" + (q + 2)).value(data.data[i][q].answer);
                    sheet.cell("D" + (q + 2)).value(data.data[i][q].type);
                    sheet.cell("E" + (q + 2)).value(data.data[i][q].note);
                    sheet.cell("F" + (q + 2)).value(data.data[i][q].mediaUrl);
                    sheet.cell("G" + (q + 2)).value(data.data[i][q].answerImage);
                }
            } else if (i == 3) {
                for (let p = 0; p < 4; p++) {
                    for (let q = 0; q < 6; q++) {
                        sheet.cell("C" + (2 + 6 * p + q)).value(data.data[i][p][q].question);
                        sheet.cell("D" + (2 + 6 * p + q)).value(data.data[i][p][q].answer);
                        sheet.cell("E" + (2 + 6 * p + q)).value(data.data[i][p][q].note);
                        sheet.cell("F" + (2 + 6 * p + q)).value(data.data[i][p][q].mediaUrl);
                    }
                }
            } else {
                for (let q = 0; q < 3; q++) {
                    sheet.cell("B" + (q + 2)).value(data.data[i][q].question);
                    sheet.cell("C" + (q + 2)).value(data.data[i][q].answer);
                    sheet.cell("D" + (q + 2)).value(data.data[i][q].note);
                    sheet.cell("E" + (q + 2)).value(data.data[i][q].mediaUrl);
                }
            }
        }
        return workbook.toFileAsync(path.join(__dirname, "/xlsx/main/database" + dbNumber + ".xlsx"));
    });
};

const read = async (filePath, isReadBase64) => {
    const databaseData = { STR: [], OBS: [], ACC: [], FIN: [], SFI: [] };
    await XlsxPopulate.fromFileAsync(filePath).then(async (workbook) => {
        const sheetNames = ["Start", "Obstacle", "Acceleration", "Finish", "Sub Finish"];
        for (let i = 0; i < sheetNames.length; i++) {
            const sheet = workbook.sheet(sheetNames[i]);
            if (i == 0) {
                for (let p = 0; p < 5; p++) {
                    const temp = [];
                    if (p < 4) {
                        for (let q = 0; q < 6; q++) {
                            temp[q] = {
                                subject: sheet.cell("C" + (2 + 6 * p + q)).value() || "",
                                question: sheet.cell("D" + (2 + 6 * p + q)).value() || "",
                                answer: sheet.cell("E" + (2 + 6 * p + q)).value() || "",
                                note: sheet.cell("F" + (2 + 6 * p + q)).value() || "",
                                mediaUrl: sheet.cell("G" + (2 + 6 * p + q)).value() || "",
                            };
                        }
                    } else {
                        for (let q = 0; q < 12; q++) {
                            temp[q] = {
                                subject: sheet.cell("C" + (2 + 6 * p + q)).value() || "",
                                question: sheet.cell("D" + (2 + 6 * p + q)).value() || "",
                                answer: sheet.cell("E" + (2 + 6 * p + q)).value() || "",
                                note: sheet.cell("F" + (2 + 6 * p + q)).value() || "",
                                mediaUrl: sheet.cell("G" + (2 + 6 * p + q)).value() || "",
                            };
                        }
                    }
                    databaseData.STR.push(temp);
                }
            } else if (i == 1) {
                for (let p = 0; p < 6; p++) {
                    databaseData.OBS[p] = {
                        question: sheet.cell("C" + (p + 2)).value() || "",
                        answer: String(sheet.cell("D" + (p + 2)).value()) || "",
                        note: sheet.cell("E" + (p + 2)).value() || "",
                        mediaUrl: sheet.cell("F" + (p + 2)).value() || "",
                    };
                    if (!databaseData.OBS[p].answer) databaseData.OBS[p].rowLength = 0;
                    else databaseData.OBS[p].rowLength = String(databaseData.OBS[p].answer).replace(/\s/g, "").length;
                    if (i < 4) databaseData.OBS[p].startPos = Number(sheet.cell("B" + (11 + p)).value());
                }
            } else if (i == 2) {
                for (let p = 0; p < 4; p++) {
                    databaseData.ACC[p] = {
                        question: sheet.cell("B" + (p + 2)).value() || "",
                        answer: sheet.cell("C" + (p + 2)).value() || "",
                        type: sheet.cell("D" + (p + 2)).value() || "",
                        note: sheet.cell("E" + (p + 2)).value() || "",
                        answerImage: sheet.cell("G" + (p + 2)).value() || "",
                    };
                    if (!isReadBase64) {
                        databaseData.ACC[p].mediaUrl = sheet.cell("F" + (p + 2)).value() || "";
                    } else if (databaseData.ACC[p].type == "Video") {
                        databaseData.ACC[p].mediaUrl = "data:video/mp4;base64," + (await base64Video(path.join(__dirname, "../../.." + sheet.cell("F" + (p + 2)).value())));
                    }
                }
            } else if (i == 3) {
                for (let p = 0; p < 4; p++) {
                    const temp = [];
                    for (let q = 0; q < 6; q++) {
                        temp[q] = {
                            question: sheet.cell("C" + (2 + 6 * p + q)).value() || "",
                            answer: sheet.cell("D" + (2 + 6 * p + q)).value() || "",
                            note: sheet.cell("E" + (2 + 6 * p + q)).value() || "",
                            mediaUrl: sheet.cell("F" + (2 + 6 * p + q)).value() || "",
                            point: q < 3 ? 20 : 30,
                        };
                    }
                    databaseData.FIN.push(temp);
                }
            } else {
                for (let p = 0; p < 3; p++) {
                    databaseData.SFI[p] = {
                        question: sheet.cell("B" + (p + 2)).value() || "",
                        answer: sheet.cell("C" + (p + 2)).value() || "",
                        note: sheet.cell("D" + (p + 2)).value() || "",
                        mediaUrl: sheet.cell("E" + (p + 2)).value() || "",
                    };
                }
            }
        }
    });
    return databaseData;
};

const set = async (dbNumber) => {
    const readData = await read(path.join(__dirname, "/xlsx/main/database" + dbNumber + ".xlsx"), 1);
    databaseData.STR = readData.STR;
    databaseData.OBS = readData.OBS;
    databaseData.ACC = readData.ACC;
    databaseData.FIN = readData.FIN;
    databaseData.SFI = readData.SFI;
    console.log("Đề thi đã được chọn là database " + dbNumber);
};

const get = async (dbNumber) => {
    return await read(path.join(__dirname, "/xlsx/main/database" + dbNumber + ".xlsx"), 0);
};

const base64Video = async (filePath) => {
    try {
        const data = await fs.readFile(filePath);
        return Buffer.from(data).toString("base64");
    } catch (error) {
        console.log("Không thể đọc file video Tăng tốc base64 do đường dẫn không hợp lệ. Vui lòng kiểm tra lại đường dẫn");
    }
};

module.exports = {
    update,
    read,
    set,
    get,
    handle,
    router,
    databaseData,
};
