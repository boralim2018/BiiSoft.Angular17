import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonDirective } from 'primeng/button';
import { NgIf, NgFor } from '@angular/common';

@Component({
    selector: '[navBar], nav-bar',
    templateUrl: './nav-bar.component.html',
    standalone: true,
    imports: [NgIf, ButtonDirective, NgFor, RouterLink]
})
export class NavBarComponent implements OnInit {

    @Input() hideSetting: boolean;
    @Output() settingClick: EventEmitter<any> = new EventEmitter<any>();

    @Input() navs: any[];
        
    ngOnInit() {
        
    }
}
