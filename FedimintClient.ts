import type {
  BackupRequest,
  InfoResponse,
  ListOperationsRequest,
  FederationIdsResponse,
  OperationOutput,
} from "./types/common";
import type {
  AwaitInvoiceRequest,
  AwaitLnPayRequest,
  Gateway,
  LnInvoiceRequest,
  LnInvoiceResponse,
  LnPayRequest,
  LnPayResponse,
  SwitchGatewayRequest,
} from "./types/modules/ln";
import type {
  CombineRequest,
  CombineResponse,
  ReissueRequest,
  ReissueResponse,
  SpendRequest,
  SpendResponse,
  SplitRequest,
  SplitResponse,
  ValidateRequest,
  ValidateResponse,
} from "./types/modules/mint";
import type {
  AwaitDepositRequest,
  AwaitDepositResponse,
  DepositAddressRequest,
  DepositAddressResponse,
  WithdrawRequest,
  WithdrawResponse,
} from "./types/modules/wallet";

type FedimintResponse<T> = Promise<T>;

class FedimintClientBuilder {
  private baseUrl: string;
  private password: string;
  private defaultFederationId: string;
  private inviteCode?: string;

  constructor() {
    this.baseUrl = "";
    this.password = "";
    this.defaultFederationId = "";
    this.inviteCode = undefined;
  }

  setBaseUrl(baseUrl: string): FedimintClientBuilder {
    this.baseUrl = baseUrl;

    return this;
  }

  setPassword(password: string): FedimintClientBuilder {
    this.password = password;

    return this;
  }

  setDefaultFederationId(defaultFederationId: string): FedimintClientBuilder {
    this.defaultFederationId = defaultFederationId;

    return this;
  }

  setInviteCode(inviteCode: string): FedimintClientBuilder {
    this.inviteCode = inviteCode;

    return this;
  }

  async build(): Promise<FedimintClient> {
    const client = new FedimintClient(this.baseUrl, this.password);

    let federationIds: string[] = [];

    try {
      if (this.inviteCode) {
        federationIds = (await client.join(this.inviteCode)).federation_ids;
      } else {
        federationIds = (await client.federationIds()).federation_ids;
      }
    } catch (e) {
      throw new Error(
        "Failed to connect to fedimint-http, check your configuration",
      );
    }

    if (federationIds.length === 0) {
      throw new Error(
        "Fedimint-http is not connected to any federations, must build with an invite code or connect to at least one federation manually",
      );
    }

    return client;
  }
}

class FedimintClient {
  private baseUrl: string;
  private password: string;
  private defaultFederationId: string;

  constructor(baseUrl: string, password: string, defaultFederationId?: string) {
    this.baseUrl = baseUrl + "/fedimint/v2";
    this.password = password;
    this.defaultFederationId = defaultFederationId || "";
  }

  setDefaultFederationId(defaultFederationId: string) {
    this.defaultFederationId = defaultFederationId;
  }

  /**
   * Makes a GET request to the `baseURL` at the given `endpoint`.
   * Receives a JSON response.
   * @param endpoint - The endpoint to make the request to.
   */
  private async get<T>(endpoint: string): FedimintResponse<T> {
    const res = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${this.password}` },
    });

    if (!res.ok) {
      throw new Error(`GET request failed with status ${res.status}`);
    }

    return (await res.json()) as T;
  }

  /**
   * Makes a POST request to the `baseURL` at the given `endpoint` with the provided `body`.
   * Receives a JSON response.
   * @param endpoint - The endpoint to make the request to.
   * @param body - The body of the request.
   */
  private async post<T>(endpoint: string, body: any): FedimintResponse<T> {
    const res = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.password}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      throw new Error(`POST request failed with status ${res.status}`);
    }

    return (await res.json()) as T;
  }

  /**
   * Makes a POST request to the `baseURL` at the given `endpoint` with the provided `body`.
   * Adds the default federation ID to the request body.
   * Receives a JSON response.
   * @param endpoint - The endpoint to make the request to.
   * @param body - The body of the request.
   */
  private async postWithId<T>(endpoint: string, body: any): FedimintResponse<T> {
    const res = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.password}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...body, fedimintId: this.defaultFederationId }),
    });

    if (!res.ok) {
      throw new Error(`POST request failed with status ${res.status}`);
    }

    return (await res.json()) as T;
  }

  /**
   * Uploads the encrypted snapshot of mint notest to the federation
   */
  public async backup(metadata: BackupRequest): FedimintResponse<void> {
    await this.post<void>("/admin/backup", metadata);
  }

  /**
   * Returns the API version to use to communicate with the federation
   */
  public async discoverVersion(): FedimintResponse<string> {
    return this.get<string>("/admin/discover-version");
  }

  /**
   * Returns the current set of connected federation IDs
   */
  public async federationIds(): FedimintResponse<FederationIdsResponse> {
    return await this.get<FederationIdsResponse>("/admin/federation-ids");
  }

  /**
   * Fetches wallet information including holdings, tiers, and federation metadata.
   */
  public async info(): FedimintResponse<InfoResponse> {
    return await this.get<InfoResponse>("/admin/info");
  }

  /**
   * Joins a federation with an inviteCode
   * Returns an array of federation IDs that the client is now connected to
   */
  public async join(inviteCode: string): FedimintResponse<FederationIdsResponse> {
    return await this.post<FederationIdsResponse>("/admin/join", { inviteCode });
  }

  /**
   * Outputs a list of operations that have been performed on the federation
   */
  public async listOperations(
    request: ListOperationsRequest,
  ): FedimintResponse<OperationOutput[]> {
    return await this.post<OperationOutput[]>(
      "/admin/list-operations",
      request,
    );
  }

  /**
   * Returns the client configuration for the federation
   */
  public async config(): FedimintResponse<any> {
    return await this.get<any>("/admin/config");
  }

  /**
   * A Module for interacting with Lightning
   */
  public ln = {
    /**
     * Creates a lightning invoice to receive payment via gateway
     */
    createInvoice: async (
      request: LnInvoiceRequest,
    ): FedimintResponse<LnInvoiceResponse> =>
      await this.post<LnInvoiceResponse>("/ln/invoice", request),

    /**
     * Waits for a lightning invoice to be paid
     */
    awaitInvoice: async (
      request: AwaitInvoiceRequest,
    ): FedimintResponse<InfoResponse> =>
      await this.post<InfoResponse>("/ln/await-invoice", request),

    /**
     * Pays a lightning invoice or lnurl via a gateway
     */
    pay: async (request: LnPayRequest): FedimintResponse<LnPayResponse> =>
      await this.post<LnPayResponse>("/ln/pay", request),

    /**
     * Waits for a lightning payment to complete
     */
    awaitPay: async (
      request: AwaitLnPayRequest,
    ): FedimintResponse<LnPayResponse> =>
      await this.post<LnPayResponse>("/ln/await-pay", request),

    /**
     * Outputs a list of registered lighting lightning gateways
     */
    listGateways: async (): FedimintResponse<Gateway[]> =>
      await this.get<Gateway[]>("/ln/list-gateways"),

    /**
     * Switches the active lightning gateway
     */
    switchGateway: async (
      request: SwitchGatewayRequest,
    ): FedimintResponse<Gateway> =>
      await this.post<Gateway>("/ln/switch-gateway", request),
  };

  /**
   * A module for creating a bitcoin deposit address
   */
  public wallet = {
    /**
     * Creates a new bitcoin deposit address
     */
    createDepositAddress: async (
      request: DepositAddressRequest,
    ): FedimintResponse<DepositAddressResponse> =>
      await this.post<DepositAddressResponse>(
        "/wallet/deposit-address",
        request,
      ),

    /**
     * Waits for a bitcoin deposit to be confirmed
     */
    awaitDeposit: async (
      request: AwaitDepositRequest,
    ): FedimintResponse<AwaitDepositResponse> =>
      await this.post<AwaitDepositResponse>("/wallet/await-deposit", request),

    /**
     * Withdraws bitcoin from the federation
     */
    withdraw: async (
      request: WithdrawRequest,
    ): FedimintResponse<WithdrawResponse> =>
      await this.post<WithdrawResponse>("/wallet/withdraw", request),
  };

  /**
   * A module for interacting with an ecash mint
   */
  public mint = {
    /**
     * Reissues an ecash note
     */
    reissue: async (
      request: ReissueRequest,
    ): FedimintResponse<ReissueResponse> =>
      await this.post<ReissueResponse>("/mint/reissue", request),

    /**
     * Spends an ecash note
     */
    spend: async (request: SpendRequest): FedimintResponse<SpendResponse> =>
      await this.post<SpendResponse>("/mint/spend", request),

    /**
     * Validates an ecash note
     */
    validate: async (
      request: ValidateRequest,
    ): FedimintResponse<ValidateResponse> =>
      await this.post<ValidateResponse>("/mint/validate", request),

    /**
     * Splits an ecash note
     */
    split: async (request: SplitRequest): FedimintResponse<SplitResponse> =>
      await this.post<SplitResponse>("/mint/split", request),

    /**
     * Combines ecash notes
     */
    combine: async (
      request: CombineRequest,
    ): FedimintResponse<CombineResponse> =>
      await this.post<CombineResponse>("/mint/combine", request),
  };
}

export {
  FedimintClientBuilder,
  FedimintClient
};
