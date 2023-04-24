import { Component, Input } from '@angular/core';
import { Coordinates } from 'src/app/api/models';

@Component({
    selector: 'app-ship',
    templateUrl: './ship.component.html',
    styleUrls: ['./ship.component.scss', '../../../styles.scss']
})

export class ShipComponent  {
    @Input() boardSize!: number;
    @Input() cellPixels!: number;
    @Input() name!: string;
    @Input() size!: number;
    @Input() isVertical!: boolean;
    @Input() left!: number;
    @Input() top!: number;
    @Input() col!: number;
    @Input() row!: number;
    @Input() occupiedCoords!: Coordinates[];
}