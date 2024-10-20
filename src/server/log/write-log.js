const XlsxPopulate = require("xlsx-populate");
const serverStatus = require("../../modules/server-side/server-status.js");

let logQueue = [];
let isWritingLog = false; // Biến này kiểm soát việc ghi log

const processNextLog = async () => {
    if (logQueue.length === 0 || isWritingLog) {
        return; // Nếu không có log nào trong hàng đợi hoặc đang ghi log, thoát ra
    }

    isWritingLog = true; // Đặt biến để ngăn việc ghi log trùng lặp
    const log = logQueue.shift(); // Lấy log đầu tiên ra khỏi hàng đợi

    try {
        const workbook = await XlsxPopulate.fromFileAsync(serverStatus.log.logFilePath);
        const sheet = workbook.sheet(0);
        const row = serverStatus.log.logRowNumber;
        sheet.cell("A" + row).value(Date.now());
        sheet.cell("B" + row).value(log.user);
        sheet.cell("C" + row).value(String(log.message));
        await workbook.toFileAsync(serverStatus.log.logFilePath);
        serverStatus.log.logRowNumber++;
    } catch (err) {
        console.error("Error writing log:", err);
    } finally {
        isWritingLog = false; // Kết thúc việc ghi log
        processNextLog(); // Xử lý log tiếp theo trong hàng đợi
    }
};

const writeLog = (log) => {
    logQueue.push(log); // Thêm log vào hàng đợi
    processNextLog(); // Bắt đầu xử lý hàng đợi (nếu không có log nào đang được ghi)
};

module.exports = writeLog;
