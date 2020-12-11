import { LoadingComponent } from './loading/loading.component';
import { GameComponent } from './game/game.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {path: "login", component: LoginComponent},
  {path: "home", component: HomeComponent},
  {path: "game", component: GameComponent},
  {path: "loading", component: LoadingComponent},
  
  {path: "", redirectTo: "/login", pathMatch: "full"},
  // {path: "**", component: LoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

export const RoutingComponents = [
  LoginComponent, 
  HomeComponent,
  GameComponent,
  LoadingComponent
]
