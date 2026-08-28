import { describe, expect, it } from "vitest";
import { FrankfurterValidationError } from "./errors";
import { assertSafeRequestPath } from "./request-helpers";

describe("assertSafeRequestPath", () => {
  describe("Valid Paths", () => {
    it.each([
      ["root path", "/"],
      ["simple endpoint", "/latest"],
      ["date path", "/2026-01-01"],
      ["path with query params", "/latest?from=USD&to=EUR"],
      ["nested path", "/v1/historical/2026-08-01"],
      ["encoded characters", "/latest?symbols=USD%2CEUR"],
      ["hyphens and underscores", "/cur_rencies/usd-to-eur"],
    ])("allows safe request path: %s (%s)", (_, path) => {
      expect(() => assertSafeRequestPath(path)).not.toThrow();
    });
  });

  describe("Invalid Paths (missing leading slash)", () => {
    it.each([
      ["empty string", ""],
      ["relative path without slash", "latest"],
      ["query string without path", "?from=USD"],
      ["leading whitespace before slash", " /latest"],
      ["full URL with scheme", "https://api.frankfurter.app/latest"],
    ])(
      "throws FrankfurterValidationError('Invalid request path.') for: %s (%s)",
      (_, path) => {
        expect(() => assertSafeRequestPath(path)).toThrow(
          FrankfurterValidationError,
        );
        expect(() => assertSafeRequestPath(path)).toThrow(
          "Invalid request path.",
        );
      },
    );
  });

  describe("Unsafe Paths (security violations & injection vectors)", () => {
    describe("URL Protocol Injection (://)", () => {
      it.each([
        ["/http://evil.com/latest"],
        ["/https://api.frankfurter.app"],
        ["/ftp://malicious.server/payload"],
      ])("rejects path with embedded protocol: %s", (path) => {
        expect(() => assertSafeRequestPath(path)).toThrow(
          FrankfurterValidationError,
        );
        expect(() => assertSafeRequestPath(path)).toThrow(
          "Unsafe request path detected.",
        );
      });
    });

    describe("Path Traversal (..)", () => {
      it.each([
        ["/../etc/passwd"],
        ["/latest/.."],
        ["/v1/../v2/latest"],
        ["/latest?from=USD..EUR"],
      ])("rejects path traversal attempt: %s", (path) => {
        expect(() => assertSafeRequestPath(path)).toThrow(
          FrankfurterValidationError,
        );
        expect(() => assertSafeRequestPath(path)).toThrow(
          "Unsafe request path detected.",
        );
      });
    });

    describe("Backslash / Windows Separator (\\)", () => {
      it.each([
        ["/latest\\sub"],
        ["/\\etc\\passwd"],
        ["/latest?file=\\secret"],
      ])("rejects backslash character: %s", (path) => {
        expect(() => assertSafeRequestPath(path)).toThrow(
          FrankfurterValidationError,
        );
        expect(() => assertSafeRequestPath(path)).toThrow(
          "Unsafe request path detected.",
        );
      });
    });

    describe("CRLF & Whitespace Injections (\\r, \\n, \\t)", () => {
      it.each([
        ["carriage return (\\r)", "/latest\rHeader:Injected"],
        ["newline (\\n)", "/latest\nSet-Cookie:malicious=true"],
        ["crlf pair (\\r\\n)", "/latest\r\nHost:evil.com"],
        ["tab character (\\t)", "/latest\t/subpath"],
      ])("rejects control character injection: %s", (_, path) => {
        expect(() => assertSafeRequestPath(path)).toThrow(
          FrankfurterValidationError,
        );
        expect(() => assertSafeRequestPath(path)).toThrow(
          "Unsafe request path detected.",
        );
      });
    });
  });
});
