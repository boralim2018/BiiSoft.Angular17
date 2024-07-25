import { Component, Injector, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { AppComponentBase } from 'shared/app-component-base';
import { PrimeTemplate } from 'primeng/api';
import { ListboxModule } from 'primeng/listbox';
import { FormsModule } from '@angular/forms';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ButtonDirective } from 'primeng/button';

@Component({
    selector: '[tableSetting], table-setting',
    templateUrl: './table-setting.component.html',
    standalone: true,
    imports: [ButtonDirective, InputSwitchModule, FormsModule, ListboxModule, PrimeTemplate]
})
export class TableSettingComponent extends AppComponentBase implements OnInit {

    @Input() gridLine: boolean;
    @Output() gridLineChange: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Input() columns: any[];
    @Input() selectedColumns: any[];
    @Output() selectedColumnsChange: EventEmitter<any[]> = new EventEmitter<any[]>();
    @Output() clearSetting: EventEmitter<any> = new EventEmitter<any>();

    constructor(
        injector: Injector
    ) {
        super(injector);
    }

    ngOnInit() {
        
    }
}
