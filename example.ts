import {FedimintClientBuilder} from "./FedimintClient";
import dotenv from "dotenv";

dotenv.config();

const baseUrl = process.env.BASE_URL || "http://localhost:3000";
const password = process.env.PASSWORD || "password";
const builder = new FedimintClientBuilder();
builder.setBaseUrl(baseUrl).setPassword(password);

// If you pass in an invite code, it will be set as the default federation
if (process.env.INVITE_CODE) {
  builder.setInviteCode(process.env.INVITE_CODE);
}

// The FedimintClient has a default federationId set that it'll call any module methods on
const fedimintClient = await builder.build();

// You can update the federationId to call methods on a different federation
const { federation_ids } = await fedimintClient.federationIds();
await fedimintClient.setDefaultFederationId(federation_ids[0]);

// Admin methods give summaries by federation
fedimintClient.info().then((response) => {
  console.log("Current Total Msats Ecash: ", response.total_amount_msat);
});

// All module methods are called on the default federationId
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
