import type { AppError } from "../utils/errors/Error";

export type TServiceResult<T> = {
  success: boolean;
  error?: AppError;
  data?: T;
}