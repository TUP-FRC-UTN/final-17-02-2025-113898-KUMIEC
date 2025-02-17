import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, Routes, withComponentInputBinding } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { LoginComponent } from './app/components/login/login.component';
import { GameComponent } from './app/components/game/game.component';
import { ScoresComponent } from './app/components/scores/scores.component';

const routes: Routes = [
  { path: '', component: LoginComponent }, 
  { path: 'login', component: LoginComponent },
  { path: 'game', component: GameComponent },
  { path: 'scores', component: ScoresComponent }, 
  { path: '**', redirectTo: 'login' } 
];

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient() 
  ]
}).catch(err => console.error(err));
