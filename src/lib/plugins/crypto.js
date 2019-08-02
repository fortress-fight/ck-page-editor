import utf_8 from "crypto-js/enc-utf8";
import AES from "crypto-js/aes";
const key = "uemo_page_editor!^_^";

export function encrypt(message) {
    return AES.encrypt(message, key).toString();
}

export function decrypt(code) {
    return AES.decrypt(code, key).toString(utf_8);
}
