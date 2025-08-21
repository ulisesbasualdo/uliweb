import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SeeMoreService {
  private readonly expandedEntries = signal<Set<number>>(new Set());

  isExpanded(entryId: number): boolean {
    return this.expandedEntries().has(entryId);
  }

  toggleExpanded(entryId: number): void {
    const current = this.expandedEntries();
    const newSet = new Set(current);

    if (newSet.has(entryId)) {
      newSet.delete(entryId);
    } else {
      newSet.add(entryId);
    }

    this.expandedEntries.set(newSet);
  }

  setExpanded(entryId: number, expanded: boolean): void {
    const current = this.expandedEntries();
    const newSet = new Set(current);

    if (expanded) {
      newSet.add(entryId);
    } else {
      newSet.delete(entryId);
    }

    this.expandedEntries.set(newSet);
  }
}
