import { Page } from "@playwright/test";

export type SimpleTest = [string, (page: Page) => void];
