import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserLoggedGuard } from './guards/user-logged.guard';

const routes: Routes = [
  { 
    path: '', 
    loadChildren: ()=> import('./pages/login/login.module').then( m=> m.LoginModule ),
    canActivate: [ UserLoggedGuard ]
  },
  { 
    path: 'login', 
    loadChildren: ()=> import('./pages/login/login.module').then( m=> m.LoginModule ),
    canActivate: [ UserLoggedGuard ]
  },
  { path: 'games',
    loadChildren: ()=> import('./pages/games/games.module').then( m=> m.GamesModule ),
    canActivate: [ UserLoggedGuard ],
    data: { loginRequired: true } 
  },
  { path: 'ebooks',
    loadChildren: ()=> import('./pages/ebooks/ebooks.module').then( m=> m.EbooksModule ),
    canActivate: [ UserLoggedGuard ],
    data: { loginRequired: true } 
  },
  { path: 'movies',
    loadChildren: ()=> import('./pages/movies/movies.module').then( m=> m.MoviesModule ),
    canActivate: [ UserLoggedGuard ],
    data: { loginRequired: true }  
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
