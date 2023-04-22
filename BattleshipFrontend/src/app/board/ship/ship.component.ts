import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-ship',
    templateUrl: './ship.component.html',
    styleUrls: ['./ship.component.scss', '../../../styles.scss']
})

export class ShipComponent  {

    @Input() name!: string;
    @Input() size!: number;
    @Input() rotate!: boolean;
    @Input() left!: number;
    @Input() top!: number;
    @Input() col!: number;
    @Input() row!: number;
    @Input() occupiedCoords!: number[][];

}