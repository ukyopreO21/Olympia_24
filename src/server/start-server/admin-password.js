const min = 100000;
const max = 999999;
const password = Math.floor(Math.random() * (max - min + 1)) + min;

module.exports = password;
