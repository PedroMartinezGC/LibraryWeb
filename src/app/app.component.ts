import { Component, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { NotificationsService } from './services/notifications.service';
import { SharingDataService } from './services/sharing-data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'My Library';
  public currentPage: string;
  public isLogged: boolean;

  @ViewChild('menuLine') menuLineBox: ElementRef;

  constructor( private sharingDataSrv: SharingDataService,
               private router: Router,
               private renderer2: Renderer2,
               public dialog: MatDialog,
               private notificationsSrv: NotificationsService ){
                
    this.isLogged = sessionStorage.getItem('token') ? true : false;
  }

  menuAnimation(){
    this.renderer2.setStyle( this.menuLineBox.nativeElement, 'width', '750px' );
  }

  ngAfterViewInit(){
    this.sharingDataSrv.currentRoute.subscribe( route =>{ // Get the current route for select the current page in the menu
      this.currentPage = route;
      if( this.currentPage != 'login' ) setTimeout(() => { this.menuAnimation() }, 400);
    });
  }

  logout(){
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: '¿Está seguro que quiere cerrar la sesión?' },
      height: '180px',
      width: '300px',
      panelClass: 'confirm-dialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      if( result == true ){
        sessionStorage.clear();
        this.router.navigate(['/login']);
        this.notificationsSrv.showTemporalMessage('Sesión cerrada', 'OK', 2500, 'snackbar-red');
      }
    });
  }

}
