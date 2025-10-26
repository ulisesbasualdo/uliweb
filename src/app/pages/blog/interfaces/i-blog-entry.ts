import { Type } from "@angular/core";

export interface IBlogEntry {
  id: number;
  title: string;
  needsWrap: boolean;
  date: Date;
  category: string | null;
  component: Type<unknown>;
}
