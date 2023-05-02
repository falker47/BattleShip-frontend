import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DragDropModule } from "@angular/cdk/drag-drop";

import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { PlayerComponent } from './player/player.component';
import { BoardComponent } from './board/board.component';
import { BoardInfoComponent } from './board-info/board-info.component';
import { ShipComponent } from './ship/ship.component';
import { StartGameComponent } from './start-game/start-game.component';
import { PlayerReadyComponent } from './player-ready/player-ready.component';
import { GameComponent } from './game/game.component';
import { GameInfoComponent } from './game-info/game-info.component';
import { FinalLeaderboardComponent } from './final-leaderboard/final-leaderboard.component';

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    LandingPageComponent,
    PlayerComponent,
    BoardComponent,
    BoardInfoComponent,
    ShipComponent,
    StartGameComponent,
    PlayerReadyComponent,
    GameComponent,
    GameInfoComponent,
    FinalLeaderboardComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    DragDropModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
