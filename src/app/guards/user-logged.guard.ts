import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { SharingDataService } from '../services/sharing-data.service';

@Injectable({
  providedIn: 'root'
})
export class UserLoggedGuard implements CanActivate {

  public isLogged: boolean;

  constructor( private router: Router ){}

  canActivate( route: ActivatedRouteSnapshot, state: RouterStateSnapshot ){
    const data: any = route.data;
    this.isLogged   = sessionStorage.getItem('token') ? true : false; // Check if there's a session opened

    if( data.loginRequired ){
      if( this.isLogged ){
        return true;
      }else{
        this.router.navigate(['/login']);
        return false;
      }
    }else{
      return true;
    }
  }
  
}
