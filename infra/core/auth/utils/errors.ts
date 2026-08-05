export class AuthError extends Error {
  readonly code: string;
  readonly statusCode: number;

  constructor(message: string, code = "AUTH_ERROR", statusCode = 401) {
    super(message);
    // Dynamically sets "AuthError", "AuthNotAuthenticatedError", etc.
    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = statusCode;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export class AuthNotAuthenticatedError extends AuthError {
  constructor(message = "User is not authenticated") {
    super(message, "UNAUTHENTICATED", 401);
  }
}

export class AuthUnauthorizedError extends AuthError {
  constructor(message = "Forbidden: Insufficient permissions") {
    super(message, "FORBIDDEN", 403);
  }
}

const authErrorNames = {
  AuthError: AuthError,
  AuthNotAuthenticatedError: AuthNotAuthenticatedError,
  AuthUnauthorizedError: AuthUnauthorizedError,
};
export function isAuthError(
  error: unknown,
  instance: keyof typeof authErrorNames = "AuthError",
): boolean {
  const instanceConstructor = authErrorNames[instance];
  return instanceConstructor && error instanceof instanceConstructor;
}
