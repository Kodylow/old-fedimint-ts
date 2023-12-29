import { BackupRequest, InfoResponse, ListOperationsRequest, OperationOutput } from "./types/common";
import { AwaitInvoiceRequest, AwaitLnPayRequest, Gateway, LnInvoiceRequest, LnInvoiceResponse, LnPayRequest, LnPayResponse, SwitchGatewayRequest } from "./types/modules/ln";
import { CombineRequest, CombineResponse, ReissueRequest, ReissueResponse, SpendRequest, SpendResponse, SplitRequest, SplitResponse, ValidateRequest, ValidateResponse } from "./types/modules/mint";
import { AwaitDepositRequest, AwaitDepositResponse, DepositAddressRequest, DepositAddressResponse, WithdrawRequest, WithdrawResponse } from "./types/modules/wallet";

type FedimintResponse<T> = Promise<T>;

type FedimintClientParams = {
    baseUrl: string;
    password: string;
}

class FedimintClient {
    private baseUrl: string;
    private password: string;

    constructor({ baseUrl, password }: FedimintClientParams) {
        this.baseUrl = baseUrl + '/fedimint/v2'
        this.password = password;
    }

    private async fetchWithAuth<T>(endpoint: string, options: RequestInit): FedimintResponse<T> {
        const response = await fetch(`${this.baseUrl}${endpoint}`, options);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json() as T;
    }

    private async get<T>(endpoint: string): FedimintResponse<T> {
        return this.fetchWithAuth<T>(endpoint, { method: 'GET', headers: { 'Authorization': `Bearer ${this.password}` } });
    }

    private async post<T>(endpoint: string, body: any): FedimintResponse<T> {
        return this.fetchWithAuth<T>(endpoint, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.password}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        });
    }

    public async info(): FedimintResponse<InfoResponse> {
        return this.get<InfoResponse>('/admin/info');
    }

    public async backup(metadata: BackupRequest): FedimintResponse<void> {
        return this.post<void>('/admin/backup', metadata);
    }

    public async discoverVersion(): FedimintResponse<string> {
        return this.get<string>('/admin/discover-version');
    }

    // NOTE: unimplemented
    // public async restore(): FedimintResponse<void> {
    //     return this.post<void>('/admin/restore', {});
    // }

    public async listOperations(request: ListOperationsRequest): FedimintResponse<OperationOutput[]> {
        return this.post<OperationOutput[]>('/admin/list-operations', request);
    }

    // NOTE: unimplemented
    // public async module(request: any): FedimintResponse<any> {
    //     return this.post<any>('/admin/module', request);
    // }

    public async config(): FedimintResponse<any> {
        return this.get<any>('/admin/config');
    }

    public modules = {
        ln: {
            createInvoice: async (request: LnInvoiceRequest): FedimintResponse<LnInvoiceResponse> => {
                return this.post<LnInvoiceResponse>('/ln/invoice', request);
            },
            awaitInvoice: async (request: AwaitInvoiceRequest): FedimintResponse<InfoResponse> => {
                return this.post<InfoResponse>('/ln/await-invoice', request);
            },
            pay: async (request: LnPayRequest): FedimintResponse<LnPayResponse> => {
                return this.post<LnPayResponse>('/ln/pay', request);
            },
            awaitPay: async (request: AwaitLnPayRequest): FedimintResponse<LnPayResponse> => {
                return this.post<LnPayResponse>('/ln/await-pay', request);
            },
            listGateways: async (): FedimintResponse<Gateway[]> => {
                return this.get<Gateway[]>('/ln/list-gateways');
            },
            switchGateway: async (request: SwitchGatewayRequest): FedimintResponse<Gateway> => {
                return this.post<Gateway>('/ln/switch-gateway', request);
            },
        },
        wallet: {
            createDepositAddress: async (request: DepositAddressRequest): FedimintResponse<DepositAddressResponse> => {
                return this.post<DepositAddressResponse>('/wallet/deposit-address', request);
            },
            awaitDeposit: async (request: AwaitDepositRequest): FedimintResponse<AwaitDepositResponse> => {
                return this.post<AwaitDepositResponse>('/wallet/await-deposit', request);
            },
            withdraw: async (request: WithdrawRequest): FedimintResponse<WithdrawResponse> => {
                return this.post<WithdrawResponse>('/wallet/withdraw', request);
            },
        },
        mint: {
            reissue: async (request: ReissueRequest): FedimintResponse<ReissueResponse> => {
                return this.post<ReissueResponse>('/mint/reissue', request);
            },
            spend: async (request: SpendRequest): FedimintResponse<SpendResponse> => {
                return this.post<SpendResponse>('/mint/spend', request);
            },
            validate: async (request: ValidateRequest): FedimintResponse<ValidateResponse> => {
                return this.post<ValidateResponse>('/mint/validate', request);
            },
            split: async (request: SplitRequest): FedimintResponse<SplitResponse> => {
                return this.post<SplitResponse>('/mint/split', request);
            },
            combine: async (request: CombineRequest): FedimintResponse<CombineResponse> => {
                return this.post<CombineResponse>('/mint/combine', request);
            },
        },
    }
}

export default FedimintClient;
