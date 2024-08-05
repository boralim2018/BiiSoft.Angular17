import { Component, EventEmitter, Injector, Input, OnInit, AfterViewInit, Output } from '@angular/core';
import { AppComponentBase } from 'shared/app-component-base';

@Component({ template: '' })
export abstract class FindComponentBase extends AppComponentBase implements OnInit, AfterViewInit {

    @Input() name: string;
    @Input() label: string;
    @Input() placeholder: string;
    @Input() showClear: boolean = true;
    @Input() multiple: boolean;
    @Input() required: boolean;
    @Input() optionLabel: string = 'name';

    @Input() showExclude: boolean;
    @Input() exclude: boolean;
    @Output() excludeChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    private _selectedModel: any;
    @Input() set selectedModel(value: any) {
        if (this._selectedModel !== value) {
            this._selectedModel = value;
            if (this.loaded) {
                this.selectedModelChange.emit(value);
                this.dirty = this.invalid;
            }
        }
    }

    get selectedModel(): any {
        return this._selectedModel;
    }    

    @Output() selectedModelChange: EventEmitter<any> = new EventEmitter<any>();

    loaded: boolean;
    dirty: boolean;
    validateMessage: string;

    get invalid(): boolean {
        return !this._selectedModel || (this.multiple && this._selectedModel.length == 0);
    }

    constructor(injector: Injector) {
        super(injector);
    }
    
    ngOnInit(): void {       
    }

    ngAfterViewInit(): void {
        this.loaded = true;
        if (!this.validateMessage) this.validateMessage = this.placeholder ? this.placeholder : this.l("ThisFieldIsRequired");
    }

    getDisplay(model: any): any {
        return this.isNullOrSpaces(this.optionLabel) || !this.isObject(model) ? model :
            (this.optionLabel == 'name' && model['displayName'] != undefined) || (this.optionLabel == 'displayName' && model['name'] != undefined) ?
            this.getObjLocalizeName(model) : this.getObjValue(model, this.optionLabel);
    }

    remove(i: number) {
        if (this._selectedModel instanceof Array) {
            this._selectedModel.splice(i, 1);
            this.dirty = this.invalid;
            this.selectedModelChange.emit(this._selectedModel);
        }
    }

    clear() {
        this.selectedModel = undefined;
    }

    protected mapFindResult(result: any) {
        if (!result) return;

        if (this.multiple) {
            let list = this.selectedModel instanceof Array ? this.selectedModel : [];
            let newList = result.filter(s => list.find(f => f.id == s.id) === undefined);
            this.selectedModel = list.concat(newList);
        }
        else {
            this.selectedModel = result;
        }
    }

}

