import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppRouteGuard } from '@shared/auth/auth-route-guard';
import { AppPermissions } from '../shared/AppPermissions';
import { AppLayoutComponent } from './layout/app.layout.component';

@NgModule({
    imports: [

        RouterModule.forChild([
            
            {
                path: '',
                component: AppLayoutComponent,
                canActivateChild: [AppRouteGuard],
                children: [
                    { path: '', redirectTo: 'apps', pathMatch: 'full' },
                    {
                        path: 'apps',
                        loadComponent: () => import('app/apps/apps.component').then(m => m.AppsComponent),                        
                    },
                    {
                        path: 'dashboard',
                        loadComponent: () => import('app/dashboard/dashboard.component').then(m => m.DashboardComponent),
                        data: { permission: AppPermissions.pages.dashboard }
                    },
                    {
                        path: 'admin',
                        loadChildren: () => import('app/admin/admin-routing.module').then(m => m.AdminRoutingModule), // Lazy load account module
                    },
                    {
                        path: 'main',
                        loadChildren: () => import('app/main/main-routing.module').then(m => m.MainRoutingModule), // Lazy load account module
                    },                    
                ],
            }
        ])
    ],
    exports: [RouterModule]
})
export class AppRoutingModule { }
