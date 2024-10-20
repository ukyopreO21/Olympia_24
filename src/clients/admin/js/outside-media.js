import * as main from "./main.js";

export const handle = () => {
    window.OUT_introVideo = OUT_introVideo;
    window.OUT_introAudio = OUT_introAudio;
    window.OUT_MC = OUT_MC;
    window.OUT_Player = OUT_Player;
    window.OUT_Introduce = OUT_Introduce;
    window.OUT_Flower = OUT_Flower;
    window.OUT_Ambience = OUT_Ambience;
    window.OUT_Result = OUT_Result;
    window.OUT_Prize = OUT_Prize;
    window.OUT_closeAllAudio = OUT_closeAllAudio;
};

const OUT_introVideo = () => {
    main.socket.emit("OUT_introVideo");
};

const OUT_introAudio = () => {
    main.socket.emit("OUT_introAudio");
};

const OUT_MC = () => {
    main.socket.emit("OUT_MC");
};

const OUT_Player = () => {
    main.socket.emit("OUT_Player");
};

const OUT_Introduce = (button) => {
    main.socket.emit("OUT_Introduce", button.name);
};

const OUT_Flower = (button) => {
    main.socket.emit("OUT_Flower", button.name);
};

const OUT_Ambience = () => {
    main.socket.emit("OUT_Ambience");
};

const OUT_Result = (button) => {
    main.socket.emit("OUT_Result", button.name);
};

const OUT_Prize = (button) => {
    main.socket.emit("OUT_Prize", button.name);
};

const OUT_closeAllAudio = () => {
    main.socket.emit("OUT_closeAllAudio");
};
