import { Component, Injector, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { AppComponentBase } from 'shared/app-component-base';
import { ButtonDirective } from 'primeng/button';

@Component({
    selector: '[searchFooter], search-footer',
    templateUrl: './search-footer.component.html',
    standalone: true,
    imports: [ButtonDirective]
})
export class SearchFooterComponent extends AppComponentBase implements OnInit {

    @Input() loading: boolean;
    @Input() label: string = this.l('Search');
    @Input() icon: string = 'pi pi-search';
    @Output() onSearch: EventEmitter<any> = new EventEmitter<any>();
  
    constructor(
        injector: Injector
    ) {
        super(injector);
    }

    ngOnInit() {
        
    }
    
}
