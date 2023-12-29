interface Tiered<T> {
    [amount: number]: T;
}

interface TieredSummary {
    tiered: Tiered<number>;
}

interface InfoResponse {
    federation_id: string;
    network: string;
    meta: { [key: string]: string };
    total_amount_msat: number;
    total_num_notes: number;
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
    creation_time: string;
    operation_kind: string;
    operation_meta: any;
    outcome?: any;
}

export {
    Tiered,
    TieredSummary,
    InfoResponse,
    BackupRequest,
    ListOperationsRequest,
    OperationOutput,
}
