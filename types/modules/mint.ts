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
