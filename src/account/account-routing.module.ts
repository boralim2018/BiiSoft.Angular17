import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AccountLayoutComponent } from './layout/account-layout.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: AccountLayoutComponent,
                children: [
                    { path: '', redirectTo: 'login', pathMatch: 'full' },
                    {
                        path: 'login',
                        loadComponent: () => import('./login/login.component').then(m => m.LoginComponent), // Lazy load login module
                    },
                    {
                        path: 'register',
                        loadComponent: () => import('./register/register.component').then(m => m.RegisterComponent), // Lazy load register module
                    },
                    {
                        path: 'forgot-password',
                        loadComponent: () => import('./forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent), // Lazy load password module
                    },
                    {
                        path: 'reset-password',
                        loadChildren: () => import('./reset-password/reset-password.component').then(m => m.ResetPasswordComponent), // Lazy load password module
                    }
                ]
            },
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class AccountRoutingModule { }
