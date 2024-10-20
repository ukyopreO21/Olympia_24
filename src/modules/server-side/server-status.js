const serverStatus = {
    log: {
        logFilePath: "",
        logRowNumber: 2,
    },
    chatLog: [],
    isReady: [false, false, false, false],
    databaseChosen: 1,
    playerName: ["", "", "", ""],
    playerPoint: [0, 0, 0, 0],
    currentRoundID: 0,
    currentUI: undefined,
    mediaUrl: "",
    playerGranted: undefined,
    playerAnswersData: [
        { answer: "", time: 0 },
        { answer: "", time: 0 },
        { answer: "", time: 0 },
        { answer: "", time: 0 },
    ],
    STR_Status: {
        playerNumber: 0,
        questionNumber: 0,
    },
    OBS_Status: {
        rowsStatus: [
            { isOpened: false, isOpening: false, isCorrect: false, isCornerOpened: false },
            { isOpened: false, isOpening: false, isCorrect: false, isCornerOpened: false },
            { isOpened: false, isOpening: false, isCorrect: false, isCornerOpened: false },
            { isOpened: false, isOpening: false, isCorrect: false, isCornerOpened: false },
            { isOpened: false, isOpening: false, isCorrect: false, isCornerOpened: false },
        ],
        signals: [],
        isObstacleOpened: false,
    },
    ACC_Status: {
        questionNumber: 0,
    },
    FIN_Status: {
        playerNumber: 0,
        questionNumber: 0,
        packChosen: [
            { point: 0, pos: 0 },
            { point: 0, pos: 0 },
            { point: 0, pos: 0 },
        ],
        isStarOn: false,
    },
    SFI_Status: {
        playerNumbers: [],
        questionNumber: 0,
    },
};

module.exports = serverStatus;
