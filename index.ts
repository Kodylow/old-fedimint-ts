import FedimintClient from "./FedimintClient";
import dotenv from 'dotenv';

dotenv.config();

const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
const password = process.env.PASSWORD || 'password';

const fedimintClient = new FedimintClient({ baseUrl, password });

// const info = await fedimintClient.info();
// console.log(info);

const { operation_id, invoice } = await fedimintClient.modules.ln.createInvoice({
    amount_msat: 1000,
    description: 'test',
});

console.log(operation_id, invoice);

