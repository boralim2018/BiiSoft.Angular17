import { Injector, OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';
import { AppMenuBase } from './app.menu.base';
import { AppMenuitemComponent } from './app.menuitem.component';
import { NgFor, NgIf } from '@angular/common';
import { Ripple } from 'primeng/ripple';
import { ButtonDirective } from 'primeng/button';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html',
    standalone: true,
    imports: [ButtonDirective, Ripple, NgFor, NgIf, AppMenuitemComponent]
})
export class AppMenuComponent extends AppMenuBase implements OnInit {

    constructor(injector: Injector, public layoutService: LayoutService) {
        super(injector);
    }

    ngOnInit() {

    }

    onKeydown(event: KeyboardEvent) {
        const nodeElement = (<HTMLDivElement>event.target);
        if (event.code === 'Enter' || event.code === 'Space') {
            nodeElement.click();
            event.preventDefault();
        }
    }

}
