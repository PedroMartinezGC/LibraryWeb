import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmData } from 'src/app/models/confirm';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent implements OnInit {

  public message: string;
  public result: boolean;

  constructor( public dialogRef: MatDialogRef<ConfirmDialogComponent>,
               @Inject(MAT_DIALOG_DATA) 
               public data: ConfirmData) {

      this.message = this.data.message;
}   

  ngOnInit(): void {
  }

  closeDialog( selectedOption: boolean ){
    this.dialogRef.close(selectedOption);
  }

}
