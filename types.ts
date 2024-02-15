
interface Tiered<T> {
    [amount: number]: T;
}

interface TieredSummary {
    tiered: Tiered<number>;
}

interface InfoResponse {
    federationId: string;
    network: string;
    meta: { [key: string]: string };
    totalAmountMsat: number;
    totalNumNotes: number;
    denominations_msat: TieredSummary;
}

interface BackupRequest {
    metadata: { [key: string]: string };
}

interface ListOperationsRequest {
    limit: number;
}

interface OperationOutput {
    id: string;
    creationTime: string;
    operationKind: string;
    operationMeta: any;
    outcome?: any;
}

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

interface AwaitDepositResponse {
    status: string;
}

interface WithdrawRequest {
    address: string;
    amountMsat: string;
}

interface WithdrawResponse {
    txid: string;
    fees_sat: number;
}

interface LnInvoiceRequest {
    amount_msat: number;
    description: string;
    expiry_time?: number;
}

interface LnInvoiceResponse {
    operation_id: string;
    invoice: string;
}

interface AwaitInvoiceRequest {
    operation_id: string;
}

interface LnPayRequest {
    payment_info: string;
    amount_msat?: number;
    finish_in_background: boolean;
    lnurl_comment?: string;
}

interface LnPayResponse {
    operation_id: string;
    payment_type: string;
    contract_id: string;
    fee: number;
}

interface AwaitLnPayRequest {
    operation_id: string;
}

interface Gateway {
    node_pub_key: string;
    active: boolean;
}

interface SwitchGatewayRequest {
    gateway_id: string;
}

interface FederationIdPrefix {
    0: number; // Assuming u8 is equivalent to number in TypeScript
    1: number;
    2: number;
    3: number;
}

interface TieredMulti<T> {
    [amount: number]: T[]; // Assuming Amount is equivalent to number in TypeScript
}

interface Signature {
    0: G1Affine;
}

interface G1Affine {
    x: Fp;
    y: Fp;
    infinity: Choice;
}

interface Fp {
    0: number[]; // Assuming u64 is equivalent to number in TypeScript
}

interface Choice {
    0: number; // Assuming u8 is equivalent to number in TypeScript
}

interface KeyPair {
    0: number[]; // Assuming c_uchar is equivalent to number in TypeScript
}

interface OOBNotesData {
    Notes?: TieredMulti<SpendableNote>;
    FederationIdPrefix?: FederationIdPrefix;
    Default?: {
        variant: number; // Assuming u64 is equivalent to number in TypeScript
        bytes: number[]; // Assuming Vec<u8> is equivalent to number[] in TypeScript
    };
}

interface OOBNotes {
    0: OOBNotesData[];
}

interface SpendableNote {
    signature: Signature;
    spend_key: KeyPair;
}

interface ReissueRequest {
    notes: OOBNotes;
}

interface ReissueResponse {
    amount_msat: number;
}

interface SpendRequest {
    amount_msat: number;
    allow_overpay: boolean;
    timeout: number;
}

interface SpendResponse {
    operation: string;
    notes: OOBNotes; 
}

interface ValidateRequest {
    notes: OOBNotes;
}

interface ValidateResponse {
    amount_msat: number;
}

interface SplitRequest {
    notes: OOBNotes;
}

interface SplitResponse {
    notes: Record<number, OOBNotes>;
}

interface CombineRequest {
    notes: OOBNotes[];
}

interface CombineResponse {
    notes: OOBNotes;
}

export {
    Tiered,
    TieredSummary,
    InfoResponse,
    BackupRequest,
    ListOperationsRequest,
    OperationOutput,
    DepositAddressRequest,
    DepositAddressResponse,
    AwaitDepositRequest,
    AwaitDepositResponse,
    WithdrawRequest,
    WithdrawResponse,
    LnInvoiceRequest,
    LnInvoiceResponse,
    AwaitInvoiceRequest,
    LnPayRequest,
    LnPayResponse,
    AwaitLnPayRequest,
    Gateway,
    SwitchGatewayRequest,
    ReissueRequest,
    ReissueResponse,
    SpendRequest,
    SpendResponse,
    ValidateRequest,
    ValidateResponse,
    SplitRequest,
    SplitResponse,
    CombineRequest,
    CombineResponse,
};
