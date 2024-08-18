import { Component, Injector, OnInit, EventEmitter, Input, AfterViewInit, Output } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { AppComponentBase } from '../../app-component-base';

@Component({
    selector: 'select-date, [selectDate]',
    templateUrl: './select-date.component.html',
    standalone: true,
    imports: [FormsModule, NgIf, CalendarModule]
})
export class SelectDateComponent extends AppComponentBase implements OnInit, AfterViewInit {
    
    @Input() name: string;
    @Input() label: string;
    @Input() placeholder: string;
    @Input() inputId: string;
    @Input() appendTo: any = 'body'
    @Input() required: boolean;

    private _selectedModel: Date | undefined;
    @Input()
    set selectedModel(value: Date | undefined) {
        this._selectedModel = value;

        if (this.loaded) {
            this.selectedModelChange.emit(value);
            this.dirty = !value;
        }
    }
    get selectedModel(): Date | undefined {
        return this._selectedModel;
    }
    @Output() selectedModelChange: EventEmitter<Date | undefined> = new EventEmitter<Date | undefined>();

    dirty: boolean;
    loaded: boolean;

    constructor(injector: Injector) {
        super(injector);
    }

    ngOnInit(): void {      
        this.placeholder = this.l('Select_', this.l('Date'));
    }

    ngAfterViewInit(): void {
        this.loaded = true;
    }

    onInput(event) {
        let input = event.currentTarget as HTMLInputElement;
        if (!input.value) {
            this.selectedModel = undefined;
            this.selectedModelChange.emit(undefined);
        }

        this.dirty = !this.selectedModel; //|| (this.multiple && !(this.selectedModel && this.selectedModel.length))
    }

    onClearClick($event) {
        this.selectedModel = undefined;
        this.selectedModelChange.emit(undefined);

        this.dirty = !this.selectedModel;
    }
    
}
