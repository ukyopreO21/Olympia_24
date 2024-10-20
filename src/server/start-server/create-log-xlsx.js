const path = require("path");
const XlsxPopulate = require("xlsx-populate");
const serverStatus = require("../../modules/server-side/server-status.js");

const createLogXlsx = () => {
    const fileName = "log-" + Date.now() + ".xlsx";
    const filePath = path.join(__dirname, "../log/logs-folder/" + fileName);

    XlsxPopulate.fromBlankAsync()
        .then((workbook) => {
            const sheet = workbook.sheet(0);
            sheet.column("A").width(20);
            sheet.column("B").width(20);
            sheet.column("C").width(50);

            sheet.column("A").style("wrapText", true);
            sheet.column("B").style("wrapText", true);
            sheet.column("C").style("wrapText", true);

            sheet.cell("A1").value("unix timestamp");
            sheet.cell("B1").value("user");
            sheet.cell("C1").value("message");
            return workbook.toFileAsync(filePath);
        })
        .then(() => {
            serverStatus.log.logFilePath = filePath;
            console.log("File log cho phiên server này đã được tạo thành công. Tên file:", fileName);
        })
        .catch((err) => {
            console.error("Lỗi khi tạo file log:", err);
        });
};

module.exports = createLogXlsx;
