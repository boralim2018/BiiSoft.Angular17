import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
    providedIn: 'root',
})
export class BiiNotifyService {

    constructor(private message: MessageService) { }

    success(message: string, title?: string): void {
        this.message.add({ severity: 'success', summary: title ?? 'Success', detail: message });
    }

    info(message: string, title?: string): void {
        this.message.add({ severity: 'info', summary: title ?? 'Info', detail: message });
    }

    warn(message: string, title?: string): void {
        this.message.add({ severity: 'warn', summary: title ?? 'Warn', detail: message });
    }
    error(message: string, title?: string): void {
        this.message.add({ severity: 'error', summary: title ?? 'Error', detail: message });
    }
}
