import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharingDataService {

  public currentRoute: EventEmitter<any> = new EventEmitter<any>; // Route for share data between components without direct hierarchy
}
