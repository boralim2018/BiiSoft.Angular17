import { Component, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { LayoutService } from "./service/app.layout.service";

@Component({
    selector: 'app-footer',
    templateUrl: './app.footer.component.html',
    standalone: true
})
export class AppFooterComponent extends AppComponentBase {

    currentYear: number;
    versionText: string;

    constructor(injector: Injector, public layoutService: LayoutService) {
        super(injector);

        this.currentYear = new Date().getFullYear();
        this.versionText = this.appSession.application.version + ' [' + this.appSession.application.releaseDate.format('YYYY-MM-DD') + ']';
    }
}
