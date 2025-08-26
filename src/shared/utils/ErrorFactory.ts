import { ErrorCodes } from "@/shared/types/ErrorTypes";
import { FirebaseError } from "firebase/app";

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

export class ErrorFactory {
    static create(error: any): AppError {
        if (error instanceof FirebaseError) {
            return this.mapFirebaseError(error);
        }

        if (error?.message?.includes('network') || error?.code === 'NETWORK_ERROR') {
            return new AppError(
                'Erro de conexão. Verifique sua internet.',
                ErrorCodes.NETWORK_ERROR,
                error
            );
        }

        return new AppError(
            'Ocorreu um erro inesperado', 
            ErrorCodes.GENERIC_ERROR, 
            error
        );
    }
    
    private static mapFirebaseError(error: FirebaseError): AppError {
        switch (error.code) {
            case "permission-denied":
                return new FirestoreError(
                    "Você não tem permissão para realizar esta ação. Sua sessão pode ter expirado ou você não tem as credenciais necessárias.",
                    ErrorCodes.FIRESTORE_PERMISSION_DENIED,
                    error
                );

            case "unavailable":
                return new FirestoreError(
                    "O serviço está temporariamente indisponível. Por favor, verifique sua conexão com a internet ou tente novamente mais tarde.",
                    ErrorCodes.FIRESTORE_UNAVAILABLE,
                    error
                );

            case "not-found":
                return new FirestoreError(
                    "O recurso solicitado não foi encontrado.",
                    ErrorCodes.FIRESTORE_NOT_FOUND,
                    error
                );

            case "auth/email-already-in-use":
            case "auth/invalid-email":
            case "auth/user-disabled":
            case "auth/user-not-found":
            case "auth/wrong-password":
                return new AppError(
                    "Problema de autenticação. Por favor, verifique suas credenciais.",
                    ErrorCodes.AUTH_UNAUTHENTICATED,
                    error
                );

            case "resource-exhausted":
                return new FirestoreError(
                    "O limite de requisições foi atingido. Por favor, tente novamente mais tarde.",
                    ErrorCodes.FIRESTORE_UNKNOWN,
                    error
                );

            default:
                return new FirestoreError(
                    `Ocorreu um erro inesperado do serviço. Código: ${error.code}.`,
                    ErrorCodes.FIRESTORE_UNKNOWN,
                    error
                );
        }
    }
}