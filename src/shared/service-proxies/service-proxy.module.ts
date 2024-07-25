import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AbpHttpInterceptor } from 'abp-ng2-module';

//import * as ApiServiceProxies from './service-proxies';
import { SessionServiceProxy, TokenAuthServiceProxy, ConfigurationServiceProxy } from './service-proxies';

@NgModule({
    providers: [
        SessionServiceProxy,
        TokenAuthServiceProxy,
        ConfigurationServiceProxy,
        { provide: HTTP_INTERCEPTORS, useClass: AbpHttpInterceptor, multi: true }
    ]
})
export class ServiceProxyModule { }
