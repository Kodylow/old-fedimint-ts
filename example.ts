import { FedimintClientBuilder } from "fedimint-ts";
import dotenv from "dotenv";

dotenv.config();

async function main() {
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
  const { federationIds } = await fedimintClient.federationIds();
  await fedimintClient.setDefaultFederationId(federationIds[0]);

  // Any methods that call on a specific federation can optionally take a federationId as the last argument
  // If no federationId is passed, the default federationId is used
  const _ = await fedimintClient.listOperations({ limit: 10 }, federationIds[1]);

  // Admin methods give summaries by federation
  fedimintClient.info().then((response) => {
    console.log("Current Total Msats Ecash: ", response.totalAmountMsat);
  });

  // All module methods are called on the default federationId if you don't pass in a federationId
  const { operationId, invoice } = await fedimintClient.ln.createInvoice({
    amountMsat: 10000,
    description: "test",
  });

  console.log("Created 10 sat Invoice: ", invoice);

  console.log("Waiting for payment...");

  fedimintClient.ln.awaitInvoice({ operationId }).then((response) => {
    console.log("Payment Received!");
    console.log("New Total Msats Ecash: ", response.totalAmountMsat);
  });
}

main().catch(console.error);
