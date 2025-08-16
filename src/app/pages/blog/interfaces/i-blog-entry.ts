import { Type } from "@angular/core";

export interface IBlogEntry {
  id: number;
  title: string;
  date: Date;
  category: string | null;
  component: Type<unknown>;
}
