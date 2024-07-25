import { Call } from '@angular/compiler';
import { Injector, OnInit, Component, Output, EventEmitter } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { AppComponentBase } from 'shared/app-component-base';
import { Mixin } from 'ts-mixer';
import { PrimeNgListComponentBase } from './prime-ng-list-component-base';


export abstract class AppDynamicDialogBase extends AppComponentBase {

    containerClass: string;

    constructor(injector: Injector) {
        super(injector);

    }

    private dialogWatchTick: number = 0;
    private dialogWatcher: Subscription;
    protected initDialogWatcher(callBack: Function) {
        this.dialogWatcher = interval(300).subscribe((x => {
            if (this.dialogWatchTick > 15) this.dialogWatcher.unsubscribe();
            this.dialogWatchTick++;

            let dialogContent = document.querySelector(this.containerClass ? this.containerClass + ' .p-dialog-content' : '.p-dialog-content');
            if (dialogContent) {
                this.dialogWatcher.unsubscribe();
                this.initDialogFooter(dialogContent);
                if (callBack) callBack(dialogContent);
            }
        }));
    }

    protected initDialogFooter(dialogContent: Element) {
        if (!dialogContent) return;

        let dialogTitle = dialogContent.querySelector('.p-dialog-title');
        if (dialogTitle) dialogContent.parentNode.insertBefore(dialogTitle, dialogContent);

        let dialogFooter = dialogContent.querySelector('.p-dialog-footer');
        if (dialogFooter) dialogContent.parentNode.insertBefore(dialogFooter, dialogContent.nextSibling);

        let form = dialogContent.querySelector('form') as HTMLFormElement;
        let dialog = document.querySelector(this.containerClass ? this.containerClass + '.p-dynamic-dialog' : '.p-dynamic-dialog') as HTMLElement;
        if (form && dialog) {
            let formContainer = form.parentNode as HTMLElement;
            document.body.insertBefore(form, document.body.firstChild);
            this.moveChildren(form, formContainer);
            this.moveChildren(dialog, form);
            dialog.appendChild(form);
        }
    }

    private moveChildren(oldParent: HTMLElement, newParent: HTMLElement) {
        while (oldParent.childNodes.length > 0) {
            newParent.appendChild(oldParent.childNodes[0]);
        }
    }
}


@Component({
    template: ''
})
export abstract class DynamicDialogBase extends AppDynamicDialogBase implements OnInit {

   
    @Output() contentLoaded: EventEmitter<Element> = new EventEmitter<Element>();

    constructor(injector: Injector) {
        super(injector);

    }

    ngOnInit(): void {
       this.initDialogWatcher((dl: Element) => this.contentLoaded.emit(dl));
    }
}
