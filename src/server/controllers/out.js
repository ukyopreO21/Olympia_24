const handle = (io, socket) => {
    socket.on("OUT_introVideo", () => {
        io.emit("_OUT_introVideo");
    });

    socket.on("OUT_introAudio", () => {
        io.emit("_OUT_introAudio");
    });

    socket.on("OUT_MC", () => {
        io.emit("_OUT_MC");
    });

    socket.on("OUT_Player", () => {
        io.emit("_OUT_Player");
    });

    socket.on("OUT_Introduce", (num) => {
        io.emit("_OUT_Introduce", num);
    });

    socket.on("OUT_Flower", (num) => {
        io.emit("_OUT_Flower", num);
    });

    socket.on("OUT_Ambience", () => {
        io.emit("_OUT_Ambience");
    });

    socket.on("OUT_Result", (num) => {
        io.emit("_OUT_Result", num);
    });

    socket.on("OUT_Prize", (num) => {
        io.emit("_OUT_Prize", num);
    });

    socket.on("OUT_closeAllAudio", () => {
        io.emit("_OUT_closeAllAudio");
    });
};

module.exports = handle;
