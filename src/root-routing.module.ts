import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccessComponent } from './shared/components/access/access.component';
import { NotfoundComponent } from './shared/components/notfound/notfound.component';

const routes: Routes = [
    { path: '', redirectTo: 'app/apps', pathMatch: 'full' },
    {
        path: 'account',
        loadChildren: () => import('account/account-routing.module').then(m => m.AccountRoutingModule), // Lazy load account module
    },
    {
        path: 'app',
        loadChildren: () => import('app/app-routing.module').then(m => m.AppRoutingModule), // Lazy load account module
    },
    { path: 'pages/access', component: AccessComponent },
    { path: 'pages/notfound', component: NotfoundComponent },
    { path: '**', redirectTo: 'pages/notfound' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' })],
    exports: [RouterModule],
    providers: []
})
export class RootRoutingModule { }
