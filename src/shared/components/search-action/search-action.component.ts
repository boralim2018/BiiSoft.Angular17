import { Component, Injector, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { AppComponentBase } from 'shared/app-component-base';
import { MenuModule } from 'primeng/menu';
import { ButtonDirective } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
    selector: '[searchAction], search-action',
    templateUrl: './search-action.component.html',
    standalone: true,
    imports: [NgIf, FormsModule, InputTextModule, ButtonDirective, MenuModule]
})
export class SearchActionComponent extends AppComponentBase implements OnInit {

    @Input() search: boolean = true;
    @Input() keyword: string;
    @Output() keywordChange: EventEmitter<string> = new EventEmitter<string>();
    @Output() onSearch: EventEmitter<any> = new EventEmitter<any>();
    @Input() showFilter: boolean;
    @Output() filterClick: EventEmitter<any> = new EventEmitter<any>();
    @Input() actionMenuItems: any[];

    constructor(
        injector: Injector
    ) {
        super(injector);
    }

    ngOnInit() {
        
    }
}
