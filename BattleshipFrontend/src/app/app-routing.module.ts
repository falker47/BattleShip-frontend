import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { BoardComponent } from './board/board.component';
import { GameComponent } from './game/game.component';

const routes: Routes = [
  { path: "", component: LandingPageComponent },
  { path: "board", component: BoardComponent },
  { path: "game", component: GameComponent },
  { path: "**", component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
