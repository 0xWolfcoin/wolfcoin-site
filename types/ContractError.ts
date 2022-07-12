export interface ContractError {
    reason:      string;
    code:        string;
    method:      string;
    transaction: Transaction;
    error:       ErrorWrapper;
}

export interface ErrorWrapper {
    code:    number;
    message: string;
    data:    DataWrapper;
}

export interface DataWrapper {
    originalError: OriginalError;
}

export interface OriginalError {
    code:    number;
    data:    string;
    message: string;
}

export interface Transaction {
    from:       string;
    to:         string;
    data:       string;
    accessList: null;
}
