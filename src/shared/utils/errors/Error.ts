export class AppError extends Error {
    constructor(message: string, public code: string, public originalError?: Error) {
        super(message);
        this.name = 'AppError';
    }
}

export class FirestoreError extends AppError {
    constructor(message: string, code: string, originalError?: Error) {
        super(message, code, originalError);
        this.name = 'FirestoreError';
    }
}