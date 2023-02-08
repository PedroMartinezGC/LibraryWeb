import { Injectable } from '@angular/core';

// Libraries
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AlertDialogComponent } from '../components/alert-dialog/alert-dialog.component';

type MessageColors = 'snackbar-green' | 'snackbar-red' | 'snackbar-blue';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  constructor( public dialog: MatDialog,
               private snackBar: MatSnackBar ) { }

  showAlert( message: string ): void {
    this.dialog.open(AlertDialogComponent, {
      data: { message },
      height: '150px',
      width: '300px',
      panelClass: 'alert-dialog'
    });
  }

  showTemporalMessage(message: string, action: string, duration: number, cssClass: MessageColors) {
    this.snackBar.open(message, action, { 
      duration, 
      panelClass: [ cssClass ] 
    });
  }
}
