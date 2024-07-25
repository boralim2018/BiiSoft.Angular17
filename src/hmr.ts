import { NgModuleRef, ApplicationRef } from '@angular/core';
import { createNewHosts } from '@angularclass/hmr';

export const hmrBootstrap = (module: any, bootstrap: () => Promise<ApplicationRef>) => {
    let ngApp: ApplicationRef;
    module.hot.accept();
    bootstrap().then(app => ngApp = app);
    module.hot.dispose(() => {
        const appRef: ApplicationRef = ngApp; 
        const elements = appRef.components.map(c => c.location.nativeElement);
        const makeVisible = createNewHosts(elements);       
        makeVisible();
    });
};
