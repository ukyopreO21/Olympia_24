export const violateSource = () => {
    document.addEventListener("keydown", (event) => {
        if (event.ctrlKey && (event.key === "u" || event.key === "U")) {
            event.preventDefault();
        }
    });

    document.addEventListener("contextmenu", (event) => {
        event.preventDefault();
    });

    document.addEventListener("keydown", (event) => {
        if (event.ctrlKey && (event.key === "s" || event.key === "S")) {
            event.preventDefault();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "F12") {
            event.preventDefault();
        }
    });

    document.addEventListener("keydown", function (event) {
        if (event.ctrlKey && event.shiftKey && event.key === "I") {
            event.preventDefault();
        }
    });

    document.addEventListener("dragstart", (event) => {
        event.preventDefault();
    });

    document.addEventListener("drop", (event) => {
        event.preventDefault();
    });
};
