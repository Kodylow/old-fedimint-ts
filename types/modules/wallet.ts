interface DepositAddressRequest {
    timeout: number;
}

interface DepositAddressResponse {
    operation_id: string;
    address: string;
}

interface AwaitDepositRequest {
    operation_id: string;
}

interface AwaitDepositResponse {
    status: string;
}

interface WithdrawRequest {
    address: string;
    amount_msat: string; // Assuming BitcoinAmountOrAll is serialized as a string
}

interface WithdrawResponse {
    txid: string;
    fees_sat: number;
}

export {
    DepositAddressRequest,
    DepositAddressResponse,
    AwaitDepositRequest,
    AwaitDepositResponse,
    WithdrawRequest,
    WithdrawResponse,
}
