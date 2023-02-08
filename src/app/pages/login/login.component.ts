import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationsService } from 'src/app/services/notifications.service';
import { SharingDataService } from 'src/app/services/sharing-data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public userLogin = {
    user:     '1234',
    password: '1234'
  }

  constructor( private sharingDataSrv: SharingDataService,
               private router: Router,
               private notificationsSrv: NotificationsService
             ) {

    this.sharingDataSrv.currentRoute.emit('login');
  }

  ngOnInit(): void {
  }

  @HostListener('document:keydown.enter', ['$event'])
  handleKeyboardEvent() { 
    this.login();
  }

  login(){
    if( this.userLogin.user != '1234' || this.userLogin.password != '1234' ){
      this.notificationsSrv.showAlert('Introduzca una contraseña y usuario correctos');

    }else{
      if( this.userLogin.user == '1234' && this.userLogin.password == '1234' ){
        sessionStorage.setItem('token', 'aslo45ju2kser3'); // Login token simulation

        this.router.navigate(['/games']);
      }
    }
  }

}
