export type RegionMapping = {
  tagName: string;
  headings: string[];
  children: RegionMapping[];
};
export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 0;
