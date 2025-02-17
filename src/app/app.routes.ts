import { Routes } from '@angular/router';
import { LoginComponent } from '../app/components/login/login.component';
import { GameComponent } from '../app/components/game/game.component';
import { ScoresComponent } from '../app/components/scores/scores.component';
import { AuthGuard } from '../app/guards/auth.guard'; // Si usas AuthGuard

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' }, 
  { path: 'login', loadComponent: () => import('../app/components/login/login.component').then(m => m.LoginComponent) },
  { path: 'game', loadComponent: () => import('../app/components/game/game.component').then(m => m.GameComponent), canActivate: [AuthGuard] },
  { path: 'scores', loadComponent: () => import('../app/components/scores/scores.component').then(m => m.ScoresComponent), canActivate: [AuthGuard] }, 
  { path: '**', redirectTo: 'login', pathMatch: 'full' } 
];
