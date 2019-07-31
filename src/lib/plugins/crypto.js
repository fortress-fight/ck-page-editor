var CryptoJS = require("crypto-js");

const key = "page_editor@^_^";

var ciphertext = CryptoJS.AES.encrypt("my message", key);
console.log("ciphertext:", ciphertext);

var bytes = CryptoJS.AES.decrypt(ciphertext.toString(), key);
var plaintext = bytes.toString(CryptoJS.enc.Utf8);

console.log(plaintext);
