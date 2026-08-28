import { Page } from "@playwright/test";

type TestRunner = (page: Page) => void;
export type SimpleTest = [string, ...TestRunner[]];
