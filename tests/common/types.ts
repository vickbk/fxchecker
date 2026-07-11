export type TEXT_PATTERN = RegExp | string;
export type LABEL_LOCATOR = [TEXT_PATTERN, string];
export type TEXT_WITH_NTH = [TEXT_PATTERN, number];
export type TEXT_MATCHER = TEXT_PATTERN | TEXT_WITH_NTH;
