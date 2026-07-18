import { getDB } from "@/infra/core";
import { cx_compare } from "./schema";

export const db = getDB({ cx_compare });
