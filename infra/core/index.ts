/**
 * @fileactor Infra Root
 * High-level re-exports for the `infrastructure/core` package. This file
 * aggregates auth and db exports for downstream feature imports. All modules
 * re-exported here follow the core architectural guardrails (see README).
 */

export * from "./auth";
export * from "./db";
