var socket = io();
socket.emit("getVersion");
socket.on("_getVersion", function (appVersion) {
	document.getElementById("currentVersion").textContent = appVersion;
});
socket.emit("connecting");
socket.on("sendSlot", function (data) {
	for (let i = 1; i <= 4; i++) {
		document.getElementById("name" + i).innerHTML =
			"<font color='orange'>Tên thí sinh:</font>" +
			"&nbsp;" +
			data.playerName[i - 1];
		if (!data.validSlot[i - 1]) {
			document.getElementById("button" + i).style.backgroundImage =
				"linear-gradient(to right bottom, #e78a89, #eb9897, #eea6a5, #f1b4b3, #f3c2c1)";
			document.getElementById("valid" + i).innerHTML =
				"<font color='orange'>Vị trí đang trống:</font>" +
				"&nbsp;" +
				"<font color='#FF6961'>Không</font>";
		} else {
			document.getElementById("button" + i).style.backgroundImage =
				"linear-gradient(to right bottom, #b1ff9e, #bcffac, #c7ffb9, #d2ffc6, #dcffd3)";
			document.getElementById("valid" + i).innerHTML =
				"<font color='orange'>Vị trí đang trống:</font>" +
				"&nbsp;" +
				"<font color='#77DD77;'>Có</font>";
		}
	}
});
function selectSlot(slot) {
	socket.emit("signIn", Number(slot.name));
}
socket.on("_signIn", function (data) {
	if (data.check) {
		document.getElementById("button" + data.slot).style.backgroundImage =
			"linear-gradient(to right bottom, #e78a89, #eb9897, #eea6a5, #f1b4b3, #f3c2c1)";
		document.getElementById("valid" + data.slot).innerHTML =
			"<font color='orange'>Vị trí đang trống:</font>" +
			"&nbsp;" +
			"<font color='#FF6961'>Không</font>";
		//alert("Vào phòng thành công");
		window.location.href = "/player?url=" + data.slot;
	} //else alert("Slot đã có người chọn");
});
