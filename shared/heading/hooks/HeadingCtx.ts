"use client";
import { createContext } from "react";
import type { HeadingLevel } from "../types";

export const HeadingCtx = createContext<HeadingLevel>(0);
