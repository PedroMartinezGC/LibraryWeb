import { Injectable } from '@angular/core';

type InputType  = 'DD/MM/YYYY hh:m:s' | 'YYYY/MM/DD' | 'YYYY-MM-DD hh:m:s' | 'MM/DD/YYYY';
type OutputType = 'DD/MM/YYYY' | 'DD/MM/YYYY hh:m:s' | 'YYYY-MM-DD hh:m:s' | 'MM/DD/YYYY hh:m:s' | 'MM/DD/YYYY';

@Injectable({
  providedIn: 'root'
})
export class UtilsService { // Service for functions without an specific topic

  constructor() { }

  // Take the today's date
  getDate(){
    let date = new Date; // today
    let mm   = ( date.getMonth().toString().length == 1 ) ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1).toString();
    let dd   = ( date.getDate().toString().length == 1 )  ? '0' + date.getDate()  : date.getDate().toString();
    let yyyy = date.getFullYear().toString();

    let currentDate = dd + '-' + mm + '-' + yyyy; // DD-MM-YYYY format

    return currentDate;
  }

  //Changes the date format
  parseDateByFormat(date: any, inputFormat: InputType, outputFormat: OutputType){

    let array = date.split(/\/| |:|-/);
    let newDate; 
    let yyyy;   let mm; let dd;
    let hh;     let m;  let s;

    switch(inputFormat){
      case 'DD/MM/YYYY hh:m:s': // DD/MM/YYYY is also valid
        yyyy = array[2];
        mm = array[1];
        dd = array[0];
        hh = array[3];
        m = array[4];
        s = array[5];
        break;

      case 'YYYY/MM/DD':
        yyyy = array[0];
        mm = array[1];
        dd = array[2];
        break;

      case 'YYYY-MM-DD hh:m:s': //YYYY-MM-DD is also valid
        yyyy = array[0];
        mm = array[1];
        dd = array[2];
        hh = array[3];
        m = array[4];
        s = array[5];
        break;

      case 'MM/DD/YYYY':
        yyyy = array[2];
        mm = array[0];
        dd = array[1];
        break;
    }
    switch(outputFormat){
      case 'DD/MM/YYYY': 
        newDate = dd+'/'+mm+'/'+yyyy;
        break;
      case 'MM/DD/YYYY': 
        newDate = mm+'/'+dd+'/'+yyyy;
        break;
      case 'DD/MM/YYYY hh:m:s': 
        newDate = dd+'/'+mm+'/'+yyyy+' '+hh+':'+m+':'+s;
        break;
      case 'YYYY-MM-DD hh:m:s': 
        newDate = yyyy+'-'+mm+'-'+dd+' '+hh+':'+m+':'+s;
        break;
      case 'MM/DD/YYYY hh:m:s':
        newDate = mm+'/'+dd+'/'+yyyy+' '+hh+':'+m+':'+s;
    }   
    return newDate;
  }

  // Check if a date is between two dates, or if its higher or lower to other given date
  dataBetween(date: Date, initialDate: any, finalDate: any){         
    if(
        ( ( (date <= finalDate)&&(date >= initialDate) ) ||
          ( (initialDate == undefined)||(finalDate == undefined) ) //The parameters must have Date format or undefined
        ) &&
        (
          ( (date <= finalDate )&&( (initialDate == undefined)&&(finalDate != undefined) ) ) ||
          ( (initialDate != undefined)&&(finalDate == undefined) ) ||
          ( (initialDate != undefined)&&(finalDate != undefined) ) ||
          ( (initialDate == undefined)&&(finalDate == undefined) )
        ) && 
        (
          ( (date >= initialDate)&&( (initialDate != undefined)&&(finalDate == undefined) ) ) ||
          ( (initialDate == undefined)&&(finalDate != undefined) ) ||
          ( (initialDate != undefined)&&(finalDate != undefined) ) ||
          ( (initialDate == undefined)&&(finalDate == undefined) )
        )
    ){
        return true;

    }else{ return false }
  }

  // Transform sentences with letters on uppercase or accents into lowercase sentences (used for the searchbar comparison)
  removeAccents(sentence: string){
    let newSentence = sentence.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
    return newSentence;
  }

  // Compare the values of some parameters with a given text (used for the searchbar)
  searchCollection(search: string ,data: any, filter: any){
    const temp = data.filter( subdata=>{
      for(let element in subdata){
        
          for(let f in filter){
              if(f == element){
                if(this.removeAccents(subdata[f]).indexOf(this.removeAccents(search)) !== -1 ){
                  return true;
                }
              }
          }
      } 
    });
    return temp;
  }

  // Creates a deep copy of an object or array with unlimited levels
  createDeepCopy(elementForCopy: any){
    if( typeof elementForCopy !== 'object' ){
      return elementForCopy;
    }
    let copy = Array.isArray(elementForCopy) ? [] : {};
    for( let key in elementForCopy ){
      const value = elementForCopy[key];
      copy[key] = this.createDeepCopy(value);
    }
    return copy;
  }

}
