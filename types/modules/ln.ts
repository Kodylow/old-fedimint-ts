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

interface ListGatewaysResponse {
    [federationId: string]: Gateway[];
}

interface SwitchGatewayRequest {
    gateway_id: string;
}

export type {
    LnInvoiceRequest,
    LnInvoiceResponse,
    AwaitInvoiceRequest,
    LnPayRequest,
    LnPayResponse,
    AwaitLnPayRequest,
    Gateway,
    ListGatewaysResponse,
    SwitchGatewayRequest,
}
