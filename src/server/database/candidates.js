const XlsxPopulate = require("xlsx-populate");
const serverStatus = require("../../modules/server-side/server-status.js");
const path = require("path");

const writeCandidates = async () => {
    try {
        const workbook = await XlsxPopulate.fromFileAsync(path.join(__dirname, "../database/xlsx/candidates/candidates.xlsx"));
        const sheet = workbook.sheet(0);
        for (let i = 0; i < 4; i++) {
            sheet.cell("B" + (i + 2)).value(serverStatus.playerName[i]);
            sheet.cell("C" + (i + 2)).value(serverStatus.playerPoint[i]);
        }
        await workbook.toFileAsync(path.join(__dirname, "../database/xlsx/candidates/candidates.xlsx"));
    } catch (err) {
        console.error("Error writing candidates:", err);
    }
};

const getCandidates = async () => {
    try {
        const workbook = await XlsxPopulate.fromFileAsync(path.join(__dirname, "../database/xlsx/candidates/candidates.xlsx"));
        const sheet = workbook.sheet(0);
        for (let i = 0; i < 4; i++) {
            const playerName = sheet.cell("B" + (i + 2)).value();
            const playerPoint = sheet.cell("C" + (i + 2)).value();
            serverStatus.playerName[i] = playerName ? playerName : "";
            serverStatus.playerPoint[i] = playerPoint ? playerPoint : 0;
        }
    } catch (err) {
        console.error("Error getting candidates:", err);
    }
};

module.exports = { writeCandidates, getCandidates };
