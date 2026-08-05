import { describe, expect, test } from "vitest";
import {
  AuthError,
  AuthNotAuthenticatedError,
  AuthUnauthorizedError,
  isAuthError,
} from "./errors";

describe("auth errors", () => {
  describe("AuthError", () => {
    test("should create an instance of AuthError with the correct name, code, statusCode, and message", () => {
      const errorMessage = "This is an auth error";
      const error = new AuthError(errorMessage);

      expect(error).toBeInstanceOf(AuthError);
      expect(error.name).toBe("AuthError");
      expect(error.message).toBe(errorMessage);
      expect(error.code).toBe("AUTH_ERROR");
      expect(error.statusCode).toBe(401);
    });

    test("should capture stack trace if Error.captureStackTrace is available", () => {
      const errorMessage = "This is an auth error";
      const error = new AuthError(errorMessage);

      expect(error.stack).toBeDefined();
    });

    test("should be an instance of Error", () => {
      const errorMessage = "This is an auth error";
      const error = new AuthError(errorMessage);
      expect(error).toBeInstanceOf(Error);
    });

    test("should allow custom code and statusCode", () => {
      const errorMessage = "This is a custom auth error";
      const customCode = "CUSTOM_AUTH_ERROR";
      const customStatusCode = 405;
      const error = new AuthError(errorMessage, customCode, customStatusCode);

      expect(error).toBeInstanceOf(AuthError);
      expect(error.name).toBe("AuthError");
      expect(error.message).toBe(errorMessage);
      expect(error.code).toBe(customCode);
      expect(error.statusCode).toBe(customStatusCode);
    });
  });

  describe("AuthNotAuthenticatedError", () => {
    test("should create an instance of AuthNotAuthenticatedError with the correct name, code, statusCode, and default message", () => {
      const error = new AuthNotAuthenticatedError();
      expect(error).toBeInstanceOf(AuthNotAuthenticatedError);
      expect(error.name).toBe("AuthNotAuthenticatedError");
      expect(error.message).toBe("User is not authenticated");
      expect(error.code).toBe("UNAUTHENTICATED");
      expect(error.statusCode).toBe(401);
    });

    test("should create an instance of AuthNotAuthenticatedError with a custom message", () => {
      const customMessage = "Custom authentication error message";
      const error = new AuthNotAuthenticatedError(customMessage);
      expect(error).toBeInstanceOf(AuthNotAuthenticatedError);
      expect(error.name).toBe("AuthNotAuthenticatedError");
      expect(error.message).toBe(customMessage);
      expect(error.code).toBe("UNAUTHENTICATED");
      expect(error.statusCode).toBe(401);
    });

    test("should be an instance of AuthError and Error", () => {
      const error = new AuthNotAuthenticatedError();

      expect(error).toBeInstanceOf(AuthNotAuthenticatedError);
      expect(error).toBeInstanceOf(AuthError);
      expect(error).toBeInstanceOf(Error);
    });
  });

  describe("AuthUnauthorizedError", () => {
    test("should create an instance of AuthUnauthorizedError with the correct name, code, statusCode, and default message", () => {
      const error = new AuthUnauthorizedError();
      expect(error).toBeInstanceOf(AuthUnauthorizedError);
      expect(error.name).toBe("AuthUnauthorizedError");
      expect(error.message).toBe("Forbidden: Insufficient permissions");
      expect(error.code).toBe("FORBIDDEN");
      expect(error.statusCode).toBe(403);
    });

    test("should create an instance of AuthUnauthorizedError with a custom message", () => {
      const customMessage = "Custom unauthorized error message";
      const error = new AuthUnauthorizedError(customMessage);
      expect(error).toBeInstanceOf(AuthUnauthorizedError);
      expect(error.name).toBe("AuthUnauthorizedError");
      expect(error.message).toBe(customMessage);
      expect(error.code).toBe("FORBIDDEN");
      expect(error.statusCode).toBe(403);
    });

    test("should be an instance of AuthError and Error", () => {
      const error = new AuthUnauthorizedError();
      expect(error).toBeInstanceOf(AuthUnauthorizedError);
      expect(error).toBeInstanceOf(AuthError);
      expect(error).toBeInstanceOf(Error);
    });
  });

  describe("isAuthError", () => {
    test("should return true for an instance of AuthError", () => {
      const error = new AuthError("This is an auth error");
      expect(isAuthError(error)).toBe(true);
    });

    test("should return true for an instance of AuthNotAuthenticatedError", () => {
      const error = new AuthNotAuthenticatedError();
      expect(isAuthError(error)).toBe(true);
    });

    test("should return true for an instance of AuthUnauthorizedError", () => {
      const error = new AuthUnauthorizedError();
      expect(isAuthError(error)).toBe(true);
    });

    test("should return false for an instance of a different error type", () => {
      const error = new Error("This is a generic error");
      expect(isAuthError(error)).toBe(false);
    });

    test("should return false when instance is specified and the error is not of that type", () => {
      const error = new AuthNotAuthenticatedError();
      expect(isAuthError(error, "AuthUnauthorizedError")).toBe(false);
    });

    test("should return false when instance is specified and the error is not of that type", () => {
      const error = new AuthError("This is an auth error");
      expect(isAuthError(error, "AuthNotAuthenticatedError")).toBe(false);
    });
  });
});
