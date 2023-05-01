import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { BoardComponent } from './board/board.component';
import { StartGameComponent } from './start-game/start-game.component';
import { GameComponent } from './game/game.component';
import { FinalLeaderboardComponent } from './final-leaderboard/final-leaderboard.component';
// import { PlayerReadyComponent } from './player-ready/player-ready.component';

const routes: Routes = [
  { path: "", component: LandingPageComponent },
  { path: "board", component: BoardComponent },
  { path: "start-game", component: StartGameComponent },
  // { path: "player-ready", component: PlayerReadyComponent },
  { path: "leaderboard", component: FinalLeaderboardComponent },
  { path: "game", component: GameComponent },
  { path: "**", component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
