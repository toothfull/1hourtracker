"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validation = void 0;
function validation(username) {
    const regex = new RegExp(/^[_\w]{3,15}$/);
    if (username.length < 3) {
        return false;
    }
    else if (username.length > 15) {
        return false;
    }
    else if (!regex.test(username)) {
        return false;
    }
    else {
        return username;
    }
}
exports.validation = validation;
