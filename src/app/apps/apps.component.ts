import { Component, OnInit, Injector } from '@angular/core';
import { AppConsts } from '../../shared/AppConsts';
import { AppMenuBase } from '../layout/app.menu.base';
import { RouterLink } from '@angular/router';
import { DividerModule } from 'primeng/divider';
import { NgFor, NgIf, NgClass } from '@angular/common';
 
@Component({
    selector: 'app-dashboard',
    templateUrl: './apps.component.html',
    standalone: true,
    imports: [
        NgFor,
        NgIf,
        DividerModule,
        RouterLink,
        NgClass,
    ],
})
export class AppsComponent extends AppMenuBase implements OnInit {

    title: string = this.l('Apps');

    constructor(injector: Injector)
    {
        super(injector);

    }

    ngOnInit() {
        document.title = AppConsts.appName + '/' + this.title;
    }

}
