import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  constructor() { }

  getBlog(): string {
    return 'soy el blog';
  }
}
