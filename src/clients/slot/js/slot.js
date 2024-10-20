import * as version from "../../../modules/clients-side/version.js";

const socket = io();

socket.on("serverRestarted", () => {
    alert("Server đã khởi động trở lại, vui lòng F5 để cập nhật lại tình trạng.");
    window.location.reload();
});

socket.emit("connecting");
version.requestVersion(socket);

socket.on("sendSlot", (data) => {
    for (let i = 1; i <= 4; i++) {
        document.getElementById("name-" + i).innerHTML = "<font color='orange'><i class='fa-solid fa-circle-info'></i>&nbsp;&nbsp;Tên thí sinh:</font>" + "&nbsp;" + data.playerName[i - 1];
        if (!data.validSlot[i - 1]) {
            document.getElementById("button-" + i).classList.remove("available-sign-in");
            document.getElementById("button-" + i).style.backgroundImage = "linear-gradient(to right bottom, #e78a89, #eb9897, #eea6a5, #f1b4b3, #f3c2c1)";
            document.getElementById("valid-" + i).innerHTML =
                "<font color='orange'><i class='fa-solid fa-circle-info'></i>&nbsp;&nbsp;Vị trí đang trống:</font>" + "&nbsp;" + "<font color='#FF6961'>Không</font>";
        } else {
            document.getElementById("button-" + i).classList.add("available-sign-in");
            document.getElementById("button-" + i).style.backgroundImage = "linear-gradient(to right bottom, #b1ff9e, #bcffac, #c7ffb9, #d2ffc6, #dcffd3)";
            document.getElementById("valid-" + i).innerHTML =
                "<font color='orange'><i class='fa-solid fa-circle-info'></i>&nbsp;&nbsp;Vị trí đang trống:</font>" + "&nbsp;" + "<font color='#77DD77;'>Có</font>";
        }
    }
});

const selectSlot = (slot) => {
    socket.emit("signIn", Number(slot.name));
};

socket.on("_signIn", (data) => {
    if (data.check) {
        document.getElementById("button-" + data.slot).style.backgroundImage = "linear-gradient(to right bottom, #e78a89, #eb9897, #eea6a5, #f1b4b3, #f3c2c1)";
        document.getElementById("valid-" + data.slot).innerHTML =
            "<font color='orange'><i class='fa-solid fa-circle-info'></i>&nbsp;&nbsp;Vị trí đang trống:</font>" + "&nbsp;" + "<font color='#FF6961'>Không</font>";
        window.location.href = "/player?url=" + data.slot;
    }
});

window.addEventListener("popstate", () => {
    sessionStorage.removeItem("userID");
});

if (performance.getEntriesByType("navigation")[0].type === "back_forward") {
    sessionStorage.clear();
}

window.selectSlot = selectSlot;
