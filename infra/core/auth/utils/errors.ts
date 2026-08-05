export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export class AuthNotAuthenticatedError extends AuthError {
  constructor(message = "User is not authenticated") {
    super(message);
    this.name = "AuthNotAuthenticatedError";
  }
}
