import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { SharingDataService } from 'src/app/services/sharing-data.service';
import gamesData from 'src/assets/saved-media/games.json'; // Local file

// Libraries
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';

// Interfaces
import { Game } from 'src/app/models/game';

// Services
import { UtilsService } from 'src/app/services/utils.service';
import { NotificationsService } from 'src/app/services/notifications.service';

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.scss']
})
export class GamesComponent implements OnInit {

  public gamesList: any;                      // List displayed on the DOM
  public gamesSaved: Game[]     = gamesData;  // Elements taken from local .json file
  public gameHoveredIndex: any  = undefined;
  public gameEditedIndex: any   = undefined;
  public gameEditedId: any      = undefined;

  public gameFilter = { // Params filtered with the filter
    searchbar: '',
    startDate: undefined,
    finalDate: undefined,
    platform: 'all'
  }
  public searchbarFilter = { // Params filtered by the searchbar
    name:     '',
    out:      '',
    platform: ''
  }
  public gameInputs = {
    name:       '',
    out:        '',
    platform:   '',
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
    this.sharingDataSrv.currentRoute.emit('games');
    this.filterData();
  }

  ngOnInit(): void {
  }

  goUp(){
    this.pageContent.nativeElement.scrollIntoView({ behavior: 'smooth'} );
  }

  // Show/hide the add/edit element modal
  showCreateNewGameModal( show: boolean ){
    if( show ){
      this.renderer2.setStyle(this.addNewModal.nativeElement, 'left', '0px');
    }else{
      this.renderer2.setStyle(this.addNewModal.nativeElement, 'left', '-1000px');
      this.gameEditedIndex = undefined;
    }
  }

  // Filter (searchbar included)
  filterData(){
    this.gamesList = this.gamesSaved;
    
    if( !this.gameFilter.startDate ) this.gameFilter.startDate = undefined;
    if( !this.gameFilter.finalDate ) this.gameFilter.finalDate = undefined;

    const firstFilter = this.gamesList.filter( game =>{
      let gameCreationDate = new Date(this.utilsSrv.parseDateByFormat(game.inserted, 'DD/MM/YYYY hh:m:s', 'MM/DD/YYYY'));
      if(
        (
          ( game.platform == this.gameFilter.platform ) ||
          ( this.gameFilter.platform == 'all' )
        ) &&
        (
          this.utilsSrv.dataBetween( gameCreationDate, this.gameFilter.startDate, this.gameFilter.finalDate )
        )
      ){ 
        return true;
      }else{
        return false;
      }
    });

    if( this.gameFilter.searchbar ){
      const secondFilter = this.utilsSrv.searchCollection( this.gameFilter.searchbar, firstFilter, this.searchbarFilter );
      this.gamesList     = secondFilter;
    }else{
      this.gamesList = firstFilter;
    }
  }

  // Allow clear the 'Fecha Inicial' and 'Fecha final' inputs
  clearDate(type: string){
    ( type == 'startDate' ) ? this.gameFilter.startDate = undefined : this.gameFilter.finalDate = undefined;
    this.filterData();
  }

  // Get the written text on the searchbar component
  getSearchbarText(searchbarText: string){
    this.gameFilter.searchbar = searchbarText;
    this.filterData();
  }

  // Image changing event for add/edit elements portraits
  imageChanged(event: any){
    if(event.target.files){
      let reader = new FileReader;

      reader.readAsDataURL(event.target.files[0]);
      reader.onload=(event: any)=>{
        this.gameInputs.image = event.target.result;
      }
    }
  }

  // Take the index of the hovered element
  checkGameHover(i: number, isHover: boolean){
    this.gameHoveredIndex = isHover ? i : undefined;
  }

  // ADD GAME

  setAddition(){
    for(let i in this.gameInputs) this.gameInputs[i] = '';
    this.gameEditedIndex = undefined;
    setTimeout(() => { this.showCreateNewGameModal(true) }, 200);
  }

  addGame(){
    this.gameInputs.inserted = this.utilsSrv.getDate();
    this.gameInputs.id       = (this.gamesSaved.length + 1).toString();

    if( !this.gameInputs.image ) this.gameInputs.image = 'assets/images/undefined.png';

    let newGame = this.utilsSrv.createDeepCopy(this.gameInputs); // for losing the two way data binding between inputs and the new game

    if( !this.gameInputs.name || !this.gameInputs.out || !this.gameInputs.platform ){
      this.notificationsSrv.showAlert('Introduzca un nombre, fecha de lanzamiento y plataforma.');
    }else{
      this.gamesSaved.unshift(newGame);
      this.showCreateNewGameModal(false);
      this.filterData();

      for(let i in this.gameInputs) this.gameInputs[i] = '';
      this.notificationsSrv.showTemporalMessage('Añadido con éxito', 'OK', 2500, 'snackbar-green');
    }
  }

  // EDIT GAME

  setEdition(index: number, id: string){
    for(let i in this.gameInputs) this.gameInputs[i] = '';
    
    this.goUp();
    setTimeout(() => { this.showCreateNewGameModal(true) }, 200);

    this.gamesSaved.find( game=>{
      if( game.id == id ){
        this.gameInputs.inserted  = this.utilsSrv.getDate();
        this.gameInputs.name      = game.name;
        this.gameInputs.out       = game.out;
        this.gameInputs.platform  = game.platform;
        this.gameInputs.image     = game.image;
        this.gameInputs.id        = game.id;
      }
    });
    this.gameEditedIndex = index;
    this.gameEditedId    = id;
  }

  editGame(){
    let editedGame = this.utilsSrv.createDeepCopy(this.gameInputs);

    if( !this.gameInputs.name || !this.gameInputs.out || !this.gameInputs.platform ){
      this.notificationsSrv.showAlert('Introduzca un nombre, fecha de lanzamiento y plataforma.');
    }else{
      this.gamesSaved.find( game=>{
        if( game.id == this.gameEditedId ) Object.assign(game, editedGame);
      });

      this.showCreateNewGameModal(false);
      this.filterData();
      this.gameEditedIndex = undefined;

      for(let i in this.gameInputs) this.gameInputs[i] = '';
      this.notificationsSrv.showTemporalMessage('Editado con éxito', 'OK', 2500, 'snackbar-blue');
    }
  }

  // DELETE GAME

  deleteGame(id: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: '¿Está seguro de que quiere eliminarlo?' },
      height: '180px',
      width: '300px',
      panelClass: 'confirm-dialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      if( result == true ){
        let gameDeletedIndex = this.gamesSaved.findIndex( game => game.id == id );

        this.gamesSaved.splice(gameDeletedIndex, 1);
        this.notificationsSrv.showTemporalMessage('Eliminado con éxito', 'OK', 2500, 'snackbar-red');
        this.filterData();
      }
    });
  }

}
