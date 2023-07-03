import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { SharingDataService } from 'src/app/services/sharing-data.service';
import ebooksData from 'src/assets/saved-media/ebooks.json'; // Local file

// Libraries
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';

// Interfaces
import { EBook } from 'src/app/models/ebook';

// Services
import { UtilsService } from 'src/app/services/utils.service';
import { NotificationsService } from 'src/app/services/notifications.service';


@Component({
  selector: 'app-ebooks',
  templateUrl: './ebooks.component.html',
  styleUrls: ['./ebooks.component.scss']
})
export class EbooksComponent implements OnInit {

  public ebooksList: any;                       // List displayed on the DOM
  public ebooksSaved: EBook[]    = ebooksData;  // Elements taken from local .json file
  public ebookHoveredIndex: any  = undefined;
  public ebookEditedIndex: any   = undefined;
  public ebookEditedId: any      = undefined;

  public ebookFilter = { // Params filtered with the filter
    searchbar: '',
    startDate: undefined,
    finalDate: undefined
  }
  public searchbarFilter = { // Params filtered by the searchbar
    name:     '',
    out:      '',
    author: ''
  }
  public ebookInputs = {
    name:       '',
    out:        '',
    image:      '',
    inserted:   '',
    id:         ''
  }

  @ViewChild('addNewModal') addNewModal: ElementRef; // Emerging window for add/edit new elements
  @ViewChild('pageContent') pageContent: ElementRef;

  constructor( private sharingDataSrv: SharingDataService,
               private utilsSrv: UtilsService,
               private renderer2: Renderer2,
               private notificationsSrv: NotificationsService,
               public dialog: MatDialog
             ) 
  {
    this.sharingDataSrv.currentRoute.emit('ebooks');
    this.filterData();
  }

  ngOnInit(): void {
  }

  goUp(){
    this.pageContent.nativeElement.scrollIntoView({ behavior: 'smooth'} );
  }

  // Show/hide the add/edit element modal
  showCreateNewEbookModal( show: boolean ){
    if( show ){
      this.renderer2.setStyle(this.addNewModal.nativeElement, 'left', '0px');
    }else{
      this.renderer2.setStyle(this.addNewModal.nativeElement, 'left', '-1000px');
      this.ebookEditedIndex = undefined;
    }
  }

  // Filter (searchbar included)
  filterData(){
    this.ebooksList = this.ebooksSaved;

    if( !this.ebookFilter.startDate ) this.ebookFilter.startDate = undefined;
    if( !this.ebookFilter.finalDate ) this.ebookFilter.finalDate = undefined;

    const firstFilter = this.ebooksList.filter( ebook =>{
      let ebookCreationDate = new Date(this.utilsSrv.parseDateByFormat(ebook.inserted, 'DD/MM/YYYY hh:m:s', 'MM/DD/YYYY'));

      if( this.utilsSrv.dataBetween( ebookCreationDate, this.ebookFilter.startDate, this.ebookFilter.finalDate ) ){ 
        return true;
      }else{
        return false;
      }
    });

    if( this.ebookFilter.searchbar ){
      const secondFilter = this.utilsSrv.searchCollection( this.ebookFilter.searchbar, firstFilter, this.searchbarFilter );
      this.ebooksList     = secondFilter;
    }else{
      this.ebooksList = firstFilter;
    }
  }

  // Allow clear the 'Fecha Inicial' and 'Fecha final' inputs
  clearDate(type: string){
    ( type == 'startDate' ) ? this.ebookFilter.startDate = undefined : this.ebookFilter.finalDate = undefined;
    this.filterData();
  }

  // Get the written text on the searchbar component
  getSearchbarText(searchbarText: string){
    this.ebookFilter.searchbar = searchbarText;
    this.filterData();
  }

  // Image changing event for add/edit elements portraits
  imageChanged(event: any){
    if(event.target.files){
      let reader = new FileReader;

      reader.readAsDataURL(event.target.files[0]);
      reader.onload=(event: any)=>{
        this.ebookInputs.image = event.target.result;
      }
    }
  }

  // Take the index of the hovered element
  checkEbookHover(i: number, isHover: boolean){
    this.ebookHoveredIndex = isHover ? i : undefined;
  }

  // ADD EBOOK

  setAddition(){
    for(let i in this.ebookInputs) this.ebookInputs[i] = '';
    this.ebookEditedIndex = undefined;
    setTimeout(() => { this.showCreateNewEbookModal(true) }, 200);
  }

  addEbook(){
    this.ebookInputs.inserted = this.utilsSrv.getDate();
    this.ebookInputs.id       = (this.ebooksSaved.length + 1).toString();

    if( !this.ebookInputs.image ) this.ebookInputs.image = 'assets/images/undefined.png';

    let newEbook = this.utilsSrv.createDeepCopy(this.ebookInputs); // for losing the two way data binding between inputs and the new ebook

    if( !this.ebookInputs.name || !this.ebookInputs.out ){ 
      this.notificationsSrv.showAlert('Introduzca un nombre y fecha de lanzamiento.');
    }else{
      this.ebooksSaved.unshift(newEbook);
      this.showCreateNewEbookModal(false);
      this.filterData();

      for(let i in this.ebookInputs) this.ebookInputs[i] = '';
      this.notificationsSrv.showTemporalMessage('Añadido con éxito', 'OK', 2500, 'snackbar-green');
    }
  }

  // EDIT EBOOK

  setEdition(index: number, id: string){
    for(let i in this.ebookInputs) this.ebookInputs[i] = '';
    
    this.goUp();
    setTimeout(() => { this.showCreateNewEbookModal(true) }, 200);

    this.ebooksSaved.find( movie=>{
      if( movie.id == id ){
        this.ebookInputs.inserted  = this.utilsSrv.getDate();
        this.ebookInputs.name      = movie.name;
        this.ebookInputs.out       = movie.out;
        this.ebookInputs.image     = movie.image;
        this.ebookInputs.id        = movie.id;
      }
    });
    this.ebookEditedIndex = index;
    this.ebookEditedId    = id;
  }

  editEbook(){
    let editedMovie = this.utilsSrv.createDeepCopy(this.ebookInputs);

    if( !this.ebookInputs.name || !this.ebookInputs.out ){
      this.notificationsSrv.showAlert('Introduzca un nombre, fecha de lanzamiento y plataforma.');
    }else{
      this.ebooksSaved.find( movie=>{
        if( movie.id == this.ebookEditedId ) Object.assign(movie, editedMovie);
      });

      this.showCreateNewEbookModal(false);
      this.filterData();
      this.ebookEditedIndex = undefined;

      for(let i in this.ebookInputs) this.ebookInputs[i] = '';
      this.notificationsSrv.showTemporalMessage('Editado con éxito', 'OK', 2500, 'snackbar-blue');
    }
  }

  // DELETE MOVIE

  deleteEbook(id: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: '¿Está seguro de que quiere eliminarlo?' },
      height: '180px',
      width: '300px',
      panelClass: 'confirm-dialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      if( result == true ){
        let movieDeletedIndex = this.ebooksSaved.findIndex( movie => movie.id == id );

        this.ebooksSaved.splice(movieDeletedIndex, 1);
        this.notificationsSrv.showTemporalMessage('Eliminado con éxito', 'OK', 2500, 'snackbar-red');
        this.filterData();
      }
    });
  }

}
