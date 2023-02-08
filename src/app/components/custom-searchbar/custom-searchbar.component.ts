import { Component, EventEmitter, Input, OnInit, Output, ViewChild, Renderer2, ElementRef } from '@angular/core';

@Component({
  selector: 'app-custom-searchbar',
  templateUrl: './custom-searchbar.component.html',
  styleUrls: ['./custom-searchbar.component.scss']
})
export class CustomSearchbarComponent implements OnInit {

  @Input()  placeholder: string;
  @Input()  color: string;
  @Output() inputChange = new EventEmitter<string>();

  public isHover: boolean           = false;
  public isFocus: boolean           = false;
  public textForSearch: string      = '';
  public isSearchbarEmpty: boolean  = true;

  @ViewChild('searchbar') searchbarInput: ElementRef;
  
  constructor( private renderer: Renderer2 ) { }

  ngOnInit(): void {
    if( !this.placeholder ) this.placeholder = '';
  }

  checkSearchbarChanges(){
    this.inputChange.emit(this.textForSearch);
    this.isSearchbarEmpty = ( this.textForSearch == '' ) ? true : false;

    this.resizeSearchbar();
  }

  resizeSearchbar(){
    if( this.isSearchbarEmpty ){
      this.renderer.setStyle(this.searchbarInput.nativeElement, 'width', '0px');
    }else{
      this.renderer.setStyle(this.searchbarInput.nativeElement, 'width', '240px');
    }
  }

}
