import { Component, Injector, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AppComponentBase } from 'shared/app-component-base';
import { LocalizePipe } from '@shared/pipes/localize.pipe';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { ButtonDirective } from 'primeng/button';
import { NgClass, NgIf } from '@angular/common';

@Component({
    selector: 'find-search-action, [findSearchAction]',
    templateUrl: './find-search-action.component.html',
    standalone: true,
    imports: [NgClass, ButtonDirective, NgIf, FormsModule, InputTextModule, LocalizePipe]
})
export class FindSearchActionComponent extends AppComponentBase implements OnInit {

    @Input() hideAction: boolean;
    @Input() selectDisabled: boolean;
    @Output() select: EventEmitter<any> = new EventEmitter<any>();
    @Input() searchModel: string;
    @Output() searchModelChange: EventEmitter<string> = new EventEmitter<string>();
    @Output() search: EventEmitter<any> = new EventEmitter<any>();
    @Input() cardView: boolean;
    @Output() cardViewChange: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() showSetting: EventEmitter<any> = new EventEmitter<any>();

    constructor(injector: Injector) {
        super(injector);
    }

    ngOnInit() {

    }

    onSwitchView(event: any) {
        this.cardView = !this.cardView;
        this.cardViewChange.emit(this.cardView);
    }
}
