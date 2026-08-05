import { describe, expect, test } from "vitest";
import { AuthError, AuthNotAuthenticatedError } from "./errors";

describe("auth errors", () => {
  describe("AuthError", () => {
    test("should create an instance of AuthError with the correct name and message", () => {
      const errorMessage = "This is an auth error";
      const error = new AuthError(errorMessage);

      expect(error).toBeInstanceOf(AuthError);
      expect(error.name).toBe("AuthError");
      expect(error.message).toBe(errorMessage);
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
  });

  describe("AuthNotAuthenticatedError", () => {
    test("should create an instance of AuthNotAuthenticatedError with the correct name and default message", () => {
      const error = new AuthNotAuthenticatedError();
      expect(error).toBeInstanceOf(AuthNotAuthenticatedError);
      expect(error.name).toBe("AuthNotAuthenticatedError");
      expect(error.message).toBe("User is not authenticated");
    });

    test("should create an instance of AuthNotAuthenticatedError with a custom message", () => {
      const customMessage = "Custom authentication error message";
      const error = new AuthNotAuthenticatedError(customMessage);
      expect(error).toBeInstanceOf(AuthNotAuthenticatedError);
      expect(error.name).toBe("AuthNotAuthenticatedError");
      expect(error.message).toBe(customMessage);
    });

    test("should be an instance of AuthError and Error", () => {
      const error = new AuthNotAuthenticatedError();

      expect(error).toBeInstanceOf(AuthNotAuthenticatedError);
      expect(error).toBeInstanceOf(AuthError);
      expect(error).toBeInstanceOf(Error);
    });
  });
});
