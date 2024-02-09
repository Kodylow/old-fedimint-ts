interface Tiered<T> {
    [amount: number]: T;
}

interface TieredSummary {
    tiered: Tiered<number>;
}

interface InfoResponse {
    [federationId: string]: {
        network: string;
        meta: { [key: string]: string };
        total_amount_msat: number;
        total_num_notes: number;
        denominations_msat: TieredSummary;
    };
}

interface BackupRequest {
    metadata: { [key: string]: string };
}

interface ListOperationsRequest {
    limit: number;
}

interface FederationIdsResponse {
    federation_ids: string[];
}

interface OperationOutput {
    id: string;
    creation_time: string;
    operation_kind: string;
    operation_meta: any;
    outcome?: any;
}

export type {
    Tiered,
    TieredSummary,
    InfoResponse,
    BackupRequest,
    ListOperationsRequest,
    FederationIdsResponse,
    OperationOutput,
}
