import { Component, OnInit, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { SharingDataService } from 'src/app/services/sharing-data.service';
import moviesData from 'src/assets/saved-media/movies.json'; // Local file

// Libraries
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';

// Interfaces
import { Movie } from 'src/app/models/movie';

// Services
import { UtilsService } from 'src/app/services/utils.service';
import { NotificationsService } from 'src/app/services/notifications.service';


@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.scss']
})
export class MoviesComponent implements OnInit {

  public moviesList: any;                       // List displayed on the DOM
  public moviesSaved: Movie[]    = moviesData;  // Elements taken from local .json file
  public movieHoveredIndex: any  = undefined;
  public movieEditedIndex: any   = undefined;
  public movieEditedId: any      = undefined;

  public movieFilter = { // Params filtered with the filter
    searchbar: '',
    startDate: undefined,
    finalDate: undefined,
    gender: 'all'
  }
  public searchbarFilter = { // Params filtered by the searchbar
    name:     '',
    out:      '',
    director: ''
  }
  public movieInputs = {
    name:       '',
    out:        '',
    gender:   '',
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
    this.sharingDataSrv.currentRoute.emit('movies');
    this.filterData();
  }

  ngOnInit(): void {
  }

  goUp(){
    this.pageContent.nativeElement.scrollIntoView({ behavior: 'smooth'} );
  }

  // Show/hide the add/edit element modal
  showCreateNewMovieModal( show: boolean ){
    if( show ){
      this.renderer2.setStyle(this.addNewModal.nativeElement, 'left', '0px');
    }else{
      this.renderer2.setStyle(this.addNewModal.nativeElement, 'left', '-1000px');
      this.movieEditedIndex = undefined;
    }
  }

  // Filter (searchbar included)
  filterData(){
    this.moviesList = this.moviesSaved;
    
    if( !this.movieFilter.startDate ) this.movieFilter.startDate = undefined;
    if( !this.movieFilter.finalDate ) this.movieFilter.finalDate = undefined;

    const firstFilter = this.moviesList.filter( movie =>{
      let movieCreationDate = new Date(this.utilsSrv.parseDateByFormat(movie.inserted, 'DD/MM/YYYY hh:m:s', 'MM/DD/YYYY'));
      if(
        (
          ( movie.gender == this.movieFilter.gender ) ||
          ( this.movieFilter.gender == 'all' )
        ) &&
        (
          this.utilsSrv.dataBetween( movieCreationDate, this.movieFilter.startDate, this.movieFilter.finalDate )
        )
      ){ 
        return true;
      }else{
        return false;
      }
    });

    if( this.movieFilter.searchbar ){
      const secondFilter = this.utilsSrv.searchCollection( this.movieFilter.searchbar, firstFilter, this.searchbarFilter );
      this.moviesList    = secondFilter;
    }else{
      this.moviesList = firstFilter;
    }
  }

  // Allow clear the 'Fecha Inicial' and 'Fecha final' inputs
  clearDate(type: string){
    ( type == 'startDate' ) ? this.movieFilter.startDate = undefined : this.movieFilter.finalDate = undefined;
    this.filterData();
  }

  // Get the written text on the searchbar component
  getSearchbarText(searchbarText: string){
    this.movieFilter.searchbar = searchbarText;
    this.filterData();
  }

  // Image changing event for add/edit elements portraits
  imageChanged(event: any){
    if(event.target.files){
      let reader = new FileReader;

      reader.readAsDataURL(event.target.files[0]);
      reader.onload=(event: any)=>{
        this.movieInputs.image = event.target.result;
      }
    }
  }

  // Take the index of the hovered element
  checkMovieHover(i: number, isHover: boolean){
    this.movieHoveredIndex = isHover ? i : undefined;
  }

  // ADD MOVIE

  setAddition(){
    for(let i in this.movieInputs) this.movieInputs[i] = '';
    this.movieEditedIndex = undefined;
    setTimeout(() => { this.showCreateNewMovieModal(true) }, 200);
  }

  addMovie(){
    this.movieInputs.inserted = this.utilsSrv.getDate();
    this.movieInputs.id       = (this.moviesSaved.length + 1).toString();

    if( !this.movieInputs.image ) this.movieInputs.image = 'assets/images/undefined.png';

    let newMovie = this.utilsSrv.createDeepCopy(this.movieInputs); // for losing the two way data binding between inputs and the new movie

    if( !this.movieInputs.name || !this.movieInputs.out || !this.movieInputs.gender ){
      this.notificationsSrv.showAlert('Introduzca un nombre, fecha de lanzamiento y género.');
    }else{
      this.moviesSaved.unshift(newMovie);
      this.showCreateNewMovieModal(false);
      this.filterData();

      for(let i in this.movieInputs) this.movieInputs[i] = '';
      this.notificationsSrv.showTemporalMessage('Añadido con éxito', 'OK', 2500, 'snackbar-green');
    }
  }

  // EDIT MOVIE

  setEdition(index: number, id: string){
    for(let i in this.movieInputs) this.movieInputs[i] = '';
    
    this.goUp();
    setTimeout(() => { this.showCreateNewMovieModal(true) }, 200);

    this.moviesSaved.find( movie=>{
      if( movie.id == id ){
        this.movieInputs.inserted  = this.utilsSrv.getDate();
        this.movieInputs.name      = movie.name;
        this.movieInputs.out       = movie.out;
        this.movieInputs.gender    = movie.gender;
        this.movieInputs.image     = movie.image;
        this.movieInputs.id        = movie.id;
      }
    });
    this.movieEditedIndex = index;
    this.movieEditedId    = id;
  }

  editMovie(){
    let editedMovie = this.utilsSrv.createDeepCopy(this.movieInputs);

    if( !this.movieInputs.name || !this.movieInputs.out || !this.movieInputs.gender ){
      this.notificationsSrv.showAlert('Introduzca un nombre, fecha de lanzamiento y plataforma.');
    }else{
      this.moviesSaved.find( movie=>{
        if( movie.id == this.movieEditedId ) Object.assign(movie, editedMovie);
      });

      this.showCreateNewMovieModal(false);
      this.filterData();
      this.movieEditedIndex = undefined;

      for(let i in this.movieInputs) this.movieInputs[i] = '';
      this.notificationsSrv.showTemporalMessage('Editado con éxito', 'OK', 2500, 'snackbar-blue');
    }
  }

  // DELETE MOVIE

  deleteMovie(id: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: '¿Está seguro de que quiere eliminarlo?' },
      height: '180px',
      width: '300px',
      panelClass: 'confirm-dialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      if( result == true ){
        let movieDeletedIndex = this.moviesSaved.findIndex( movie => movie.id == id );

        this.moviesSaved.splice(movieDeletedIndex, 1);
        this.notificationsSrv.showTemporalMessage('Eliminado con éxito', 'OK', 2500, 'snackbar-red');
        this.filterData();
      }
    });
  }

}
