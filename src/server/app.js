//node_modules
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const path = require("path");
const clipboard = require("copy-paste");

//start-server
const ipv4Addresses = require("./start-server/ipv4.js");
const getPORT = require("./start-server/port/read-port.js");
const version = require("./start-server/read-version.js");
const adminPassword = require("./start-server/admin-password.js");
const createLogXlsx = require("./start-server/create-log-xlsx.js");

//database
const database = require("./database/database.js");
const { getCandidates } = require("./database/candidates.js");

//controllers
const authorize = require("./controllers/authorize.js");
const chatRoom = require("./controllers/chat-room.js");
const matchRoom = require("./controllers/match-room.js");
const out = require("./controllers/out.js");
const start = require("./controllers/rounds/start.js");
const obstacle = require("./controllers/rounds/obstacle.js");
const acceleration = require("./controllers/rounds/acceleration.js");
const finish = require("./controllers/rounds/finish.js");
const subFinish = require("./controllers/rounds/sub-finish.js");

(async () => {
    const restartServer = async () => {
        io.emit("serverRestarted");
    };

    clipboard.copy(adminPassword);
    database.set(1);
    createLogXlsx();
    getCandidates();

    const startServer = async () => {
        console.clear();
        console.log("-----------------------------------------");
        const PORT = await getPORT();
        const appVersion = await version.getAppVersion();
        try {
            if (isNaN(PORT)) {
                console.error("Port không phải là số, vui lòng kiểm tra lại:", PORT);
                return;
            }
            server.listen(PORT, async () => {
                await restartServer();
                console.log("Phiên bản hiện tại:", "\x1b[91m\x1b[1m", appVersion, "\x1b[0m");
                console.log("\x1b[91m\x1b[1m" + "ĐÂY LÀ SERVER, KHÔNG ĐƯỢC TẮT CMD NÀY CHO TỚI KHI KHÔNG MỞ SERVER NỮA", "\x1b[0m");
                console.log("Danh sách địa chỉ IP của server:", "\x1b[1m", ipv4Addresses, "\x1b[0m");
                console.log("Server đã được mở tại cổng: \x1b[33m\x1b[1m", PORT);
                console.log("Hãy đảm bảo các user kết nối đều sử dụng chung một mạng để có thể kết nối đến một trong những địa chỉ IP trên", "\x1b[0m");
                console.log("Mật khẩu cho trang điều khiển và cơ sở dữ liệu (đã được copy, chỉ cần Ctrl + V): \x1b[96m%s\x1b[1m", adminPassword, "\x1b[0m");
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
    };

    await startServer();
})();

io.on("connection", (socket) => {
    version.handle(socket);
    authorize(io, socket);
    chatRoom.handle(io, socket);
    matchRoom(io, socket);
    database.handle(io, socket);
    out(io, socket);
    start(io, socket);
    obstacle(io, socket);
    acceleration(io, socket);
    finish(io, socket);
    subFinish(io, socket);
});

app.use("/public", express.static(path.join(__dirname, "../../public")));
app.use("/src/assets", express.static(path.join(__dirname, "../assets")));
app.use("/src/modules/clients-side", express.static(path.join(__dirname, "../modules/clients-side")));
const clientsPath = path.join(__dirname, "../clients");
const clientFolders = ["slot", "admin", "player", "point", "viewer", "live", "database", "mc"];
clientFolders.forEach((folder) => {
    app.use(`/src/clients/${folder}`, express.static(path.join(clientsPath, folder)));
});

app.use(database.router);
app.use(chatRoom.router);

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../clients/slot/slot.html"));
});

app.get("/admin", (req, res) => {
    res.sendFile(path.join(__dirname, "../clients/admin/admin.html"));
});

app.get("/player", (req, res) => {
    res.sendFile(path.join(__dirname, "../clients/player/player.html"));
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    res.setHeader("Surrogate-Control", "no-store");
});

app.get("/point", (req, res) => {
    res.sendFile(path.join(__dirname, "../clients/point/point.html"));
});

app.get("/viewer", (req, res) => {
    res.sendFile(path.join(__dirname, "../clients/viewer/viewer.html"));
});

app.get("/live", (req, res) => {
    res.sendFile(path.join(__dirname, "../clients/live/live.html"));
});

app.get("/database", (req, res) => {
    res.sendFile(path.join(__dirname, "../clients/database/database.html"));
});

app.get("/mc", (req, res) => {
    res.sendFile(path.join(__dirname, "../clients/mc/mc.html"));
});
