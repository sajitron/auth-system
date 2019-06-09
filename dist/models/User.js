"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    firstName: {
        type: mongoose_1.SchemaTypes.String
    },
    lastName: { type: mongoose_1.SchemaTypes.String },
    email: {
        type: mongoose_1.SchemaTypes.String,
        unique: true
    },
    logNumber: { type: mongoose_1.SchemaTypes.Number }
});
exports.default = mongoose_1.model('Users', UserSchema);
