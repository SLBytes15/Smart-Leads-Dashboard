"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCSV = void 0;
const json2csv_1 = require("json2csv");
const fields = [
    { label: 'Name', value: 'name' },
    { label: 'Email', value: 'email' },
    { label: 'Status', value: 'status' },
    { label: 'Source', value: 'source' },
    { label: 'CreatedAt', value: 'createdAt' },
];
const generateCSV = (leads) => {
    const parser = new json2csv_1.Parser({ fields });
    return parser.parse(leads);
};
exports.generateCSV = generateCSV;
