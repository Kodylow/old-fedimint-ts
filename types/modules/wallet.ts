interface DepositAddressRequest {
  timeout: number;
}

interface DepositAddressResponse {
  operationId: string;
  address: string;
}

interface AwaitDepositRequest {
  operationId: string;
}

interface BTCInput {
  previous_output: string;
  script_sig: string;
  sequence: number;
  witness: string[];
}

interface BTCOutput {
  value: number;
  script_pubkey: string;
}

interface BTCTransaction {
  version: number;
  lock_time: number;
  input: BTCInput[];
  output: BTCOutput[];
}

interface AwaitDepositResponseConfirmed {
  btc_transaction: BTCTransaction;
  out_idx: number;
}

interface AwaitDepositResponse {
  status: { Confirmed: AwaitDepositResponseConfirmed } | { Failed: string };
}

interface WithdrawRequest {
  address: string;
  amountMsat: number | "all";
}

interface WithdrawResponse {
  txid: string;
  feesSat: number;
}

export type {
  DepositAddressRequest,
  DepositAddressResponse,
  AwaitDepositRequest,
  AwaitDepositResponse,
  WithdrawRequest,
  WithdrawResponse,
};
