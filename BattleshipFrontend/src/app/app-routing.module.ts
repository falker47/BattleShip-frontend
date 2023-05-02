import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { BoardComponent } from './components/board/board.component';
import { StartGameComponent } from './components/start-game/start-game.component';
import { GameComponent } from './components/game/game.component';
import { PlayerReadyComponent } from './components/player-ready/player-ready.component';
import { FinalLeaderboardComponent } from './components/final-leaderboard/final-leaderboard.component';

const routes: Routes = [
  { path: "", component: LandingPageComponent },
  { path: "board", component: BoardComponent },
  { path: "start", component: StartGameComponent },
  { path: "player", component: PlayerReadyComponent },
  { path: "leaderboard", component: FinalLeaderboardComponent },
  { path: "game", component: GameComponent },
  { path: "**", component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
