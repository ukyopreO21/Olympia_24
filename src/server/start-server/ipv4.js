const os = require("os");

const networkInterfaces = os.networkInterfaces();
const ipv4Addresses = [];

Object.keys(networkInterfaces).forEach((interfaceName) => {
    const interfaceData = networkInterfaces[interfaceName];
    interfaceData.forEach((interfaceInfo) => {
        if (interfaceInfo.family === "IPv4" && !interfaceInfo.internal) {
            ipv4Addresses.push(interfaceInfo.address);
        }
    });
});

module.exports = ipv4Addresses;
