import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Player } from '../api/models';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss', '../../styles.scss']
})
export class BoardComponent implements OnInit {

  @Input() players!: Player[];
  width: number = 10;
  cells: number[] = [];

  @ViewChild('ships') ships!: ElementRef<HTMLElement>;


  ngOnInit() {
    for (let i = 0; i <= this.players.length; i++) {
      if (i > 2) this.width += 5;
    }
  
    this.cells = [].constructor(this.width);
  }
  

  flip() {
    this.ships.nativeElement.classList.toggle('flip');
   
    // Array.from(this.ships.nativeElement.children).forEach(elem => {
    //   if (elem.classList.contains('flip')) {
    //     return elem.classList.remove('flip');
    //   }
    //   return elem.classList.add("flip");
    // })
  }


  start() {
    console.log("Start game...");
  }

}
