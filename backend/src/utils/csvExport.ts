import { Parser } from "json2csv";
import { ILead } from "../models/Lead";

const fields = [
    {label: 'Name', value: 'name'},
    {label: 'Email', value: 'email'},
    {label: 'Status', value: 'status'},
    {label: 'Source', value: 'source'},
    {label: 'CreatedAt', value: 'createdAt'},
]

export const generateCSV = (leads: ILead[]): string => {
    const parser = new Parser({ fields });
    return parser.parse(leads);
}