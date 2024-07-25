import { Component, Injector, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { LocalizeComponent } from 'shared/app-component-base';
import { NgStyle } from '@angular/common';

@Component({
    selector: '[recordNotFound], record-not-found',
    templateUrl: './record-not-found.component.html',
    standalone: true,
    imports: [NgStyle]
})
export class RecordNotFoundComponent extends LocalizeComponent implements OnInit {

    @Input() minHeight: number = 330;
   
    constructor(
        injector: Injector
    ) {
        super(injector);
    }

    ngOnInit() {
        
    }
}
