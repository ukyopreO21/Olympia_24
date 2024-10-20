export const vietnameseRoundName = ["KHỞI ĐỘNG", "VƯỢT CHƯỚNG NGẠI VẬT", "TĂNG TỐC", "VỀ ĐÍCH", "CÂU HỎI PHỤ"];
export const englishRoundName = ["start", "obstacle", "acceleration", "finish", "sub finish"];

export const playersData = [
    { name: "", point: 0 },
    { name: "", point: 0 },
    { name: "", point: 0 },
    { name: "", point: 0 },
];

export var currentRoundID = undefined;

export const updateCurrentRoundID = (id) => {
    currentRoundID = id;
};

export const updatePlayersData = (data) => {
    for (let i = 0; i < data.length; i++) {
        playersData[i].name = data[i].name;
        playersData[i].point = data[i].point;
    }
};
