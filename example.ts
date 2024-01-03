import FedimintClient from "./FedimintClient";
import dotenv from "dotenv";

dotenv.config();

const baseUrl = process.env.BASE_URL || "http://localhost:5000";
const password = process.env.PASSWORD || "password";

const fedimintClient = new FedimintClient({ baseUrl, password });

fedimintClient.info().then((response) => {
  console.log("Current Total Msats Ecash: ", response.total_amount_msat);
});

const { operation_id, invoice } = await fedimintClient.ln.createInvoice({
  amount_msat: 10000,
  description: "test",
});

console.log("Created 10 sat Invoice: ", invoice);

console.log("Waiting for payment...");

fedimintClient.ln.awaitInvoice({ operation_id }).then((response) => {
  console.log("Payment Received!");
  console.log("New Total Msats Ecash: ", response.total_amount_msat);
});
