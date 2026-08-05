import { beforeEach, describe, expect, it, vi } from "vitest";
import { logError } from "./error-logger";

const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

class CustomError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CustomError";
  }
}

describe("Error Logger", () => {
  beforeEach(() => {
    consoleErrorSpy.mockClear();
  });

  it("should log an error when shouldLog is true", () => {
    const error = new Error("Test error");

    logError(error, true);
    expect(consoleErrorSpy).toHaveBeenCalledWith(error);
  });

  it("should not log an error when shouldLog is false", () => {
    const error = new Error("Test error");

    logError(error, false);

    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it("should log when the error is not an instance of Error", () => {
    const notAnError = "This is not an error";

    logError(notAnError, true);
    expect(consoleErrorSpy).toHaveBeenCalledWith(notAnError);
  });

  it("should not log when the error is null or undefined", () => {
    logError(null, true);
    logError(undefined, true);

    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it("should log custom error instance messages when shouldLog is true", () => {
    const err = new CustomError("Custom error message");

    logError(err, true);
    expect(consoleErrorSpy).toHaveBeenCalledWith(err);
  });

  it("should not log custom error instance messages when shouldLog is false", () => {
    const err = new CustomError("Custom error message");
    logError(err, false);
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });
});
