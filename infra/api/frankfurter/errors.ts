export class FrankfurterError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FrankfurterError";
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export class FrankfurterRateLimitError extends FrankfurterError {
  constructor(message = "Rate limit exceeded (HTTP 429)") {
    super(message);
    this.name = "FrankfurterRateLimitError";
  }
}

export class FrankfurterValidationError extends FrankfurterError {
  constructor(message = "Validation failed (HTTP 422)") {
    super(message);
    this.name = "FrankfurterValidationError";
  }
}

export class FrankfurterOfflineError extends FrankfurterError {
  constructor(message = "Network connectivity issue / offline") {
    super(message);
    this.name = "FrankfurterOfflineError";
  }
}
