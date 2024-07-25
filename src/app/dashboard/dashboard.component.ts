import { Component, OnInit, Injector, OnDestroy, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Subscription } from 'rxjs';
import { AppComponentBase, NavBarComponentBase } from '@shared/app-component-base';
import { LayoutService } from '../layout/service/app.layout.service';
import { Mixin } from 'ts-mixer';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import multiMonthPlugin from '@fullcalendar/multimonth'
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import { CreateLocationComponent } from '../admin/location/create-location/create-location.component';
import { DialogService } from 'primeng/dynamicdialog';
import { CreateUpdateLocationInputDto, LocationServiceProxy } from '../../shared/service-proxies/service-proxies';
import { ChartModule } from 'primeng/chart';
import { Ripple } from 'primeng/ripple';
import { MenuModule } from 'primeng/menu';
import { ButtonDirective } from 'primeng/button';
import { NgStyle, NgIf } from '@angular/common';
import { DividerModule } from 'primeng/divider';
import { NavBarComponent } from '../../shared/components/nav-bar/nav-bar.component';
import { Loader, LoaderOptions } from 'google-maps';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    providers: [DialogService, LocationServiceProxy],
    standalone: true,
    imports: [NavBarComponent, DividerModule, FullCalendarModule, NgStyle, ButtonDirective, MenuModule, NgIf, Ripple, ChartModule]
})
export class DashboardComponent extends Mixin(AppComponentBase, NavBarComponentBase) implements OnInit, OnDestroy {

    title: string = this.l('Dashboard');
    items: MenuItem[];
    chartData: any;
    chartOptions: any;
    subscription: Subscription;
    options: any;
    overlays: any[] = [];

    //let calendarApi = this.calendar.getApi();
    @ViewChild('calendar') calendar: FullCalendarComponent;
    calendarOptions: CalendarOptions;

    constructor(
        injector: Injector,
        private layoutService: LayoutService,
        private _dialogService: DialogService,
        private _locationService: LocationServiceProxy)
    {
        super(injector);

        this.subscription = this.layoutService.configUpdate$.subscribe(config => {
            this.initChart();
        });
    }

    ngOnInit() {
        this.setTitle();
        this.initChart();
          
        this.items = [
            {label: 'Add New', icon: 'pi pi-fw pi-plus'},
            {label: 'Remove', icon: 'pi pi-fw pi-minus'}
        ];

        this.options = {
            center: { lat: 11.5564, lng: 104.9282 },
            zoom: 14
        };

        this.initCalendarOptions(this);

        //this.getLocations();
        this.initGoogleMaps();
    }

    //getLocations() {
    //    this._locationService.getList(true, false, [], false, [], "", "Code", 1, false, 0, 10)
    //        .subscribe(r => {
    //            this.overlays = r.items.map(m => {
    //                let l = new google.maps.Marker({ position: { lat: m.latitude, lng: m.longitude }, title: this.getObjLocalizeName(m), draggable: true, label: { text: this.getObjLocalizeName(m), color: 'blue' }, icon: "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png" });
    //                l.set('l', m);
    //                let g = l.get('l');
    //                return l;
    //            });
    //        });
    //}

    initGoogleMaps() {
        //const options: LoaderOptions = { language: 'ja', region: 'JP' };
        const options: LoaderOptions = { language: 'en', region: 'KH' };
        const loader = new Loader('AIzaSyB4j90EdshV2r8UNm71wicnwv421hcUczE', options);

        loader.load().then(function (google) {
            const map = new google.maps.Map(document.getElementById('map'), {
                center: { lat: 11.5564, lng: 104.9282 },
                zoom: 14
            });
        });
    }

    initCalendarOptions(p: DashboardComponent) {
        this.calendarOptions = {
            //customButtons: {
            //    btnMonth: {
            //        text: 'Month',
            //        click: function (e) { (e.currentTarget as HTMLElement).classList.add('fc-button-active'); p.calendar.getApi().changeView('dayGridMonth'); }
            //    },
            //},
            plugins: [multiMonthPlugin, dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
            initialDate: this.getDate(),
            dateClick: this.showInfo.bind(this),
            eventClick: this.showError.bind(this),
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'listMonth,timeGridDay,dayGridWeek,dayGridMonth,multiMonthYear'
            },
            initialView: 'dayGridMonth',
            //multiMonthMaxColumns: 1,
            editable: true,
            selectable: true,
            selectMirror: true,
            dayMaxEvents: true,
            events: [
                {
                    title: 'Today',
                    start: this.getDate(1),
                    end: this.getDate(3),
                },
                {
                    title: 'Event2',
                    start: this.getDate(1),
                    end: this.getDate(2),
                },
            ],
            //eventClassNames: ['primary-text-color']
        };
    }

    getDate(addDay: number = 0) {
        const date = new Date();       
        return new Date(date.getFullYear(), date.getMonth(), date.getDate() + addDay, 16, 30, 0);
    }

    //onMapClick(event: any) {       

    //    let model = new CreateUpdateLocationInputDto();
    //    model.latitude = event.latLng.lat();
    //    model.longitude = event.latLng.lng();

    //    const createDialog = this._dialogService.open(CreateLocationComponent, {
    //        data: { model: model },
    //        header: this.l('Create') + ' ' + this.l('Location'),
    //        styleClass: this.responsiveDialogClass
    //    });

    //    createDialog.onClose.subscribe((result: CreateUpdateLocationInputDto) => {
    //        if (result) {
    //            let maker = new google.maps.Marker({ position: { lat: result.latitude, lng: result.longitude }, title: this.getObjLocalizeName(result), draggable: true });
    //            this.overlays.push(maker);
    //        }
    //    });
    //}

    //onOverlayDragEnd(event) {
    //    let marker = event.overlay;
    //    this.message.info(marker.position);
    //}

    //onOverlayClick(vent) {
    //    this.notify.info("click");
    //}

    showInfo() {
        this.message.info("Infor", "Dialog Info");
    }

    showError() {
        this.message.error("Error", "Dialog Error");
    }

    showWarning() {
        this.message.warn("Warning", "Dialog Warning");
    }

    showSuccess() {
        this.message.success("Success", "Dialog Success");
    }

    showConfirm() {
        this.message.confirm("Confirm " + this.l('Yes') + ' or ' + this.l('No'), "Dialog Confirm", (result) => {
            if (result) {
                this.notify.success("Confirm Yes " + this.l('Yes'), "Confirm Notification");
            }
            else {
                this.notify.warn("Confirm No " + this.l('No'), "Confirm Notification");
            }
        });
    }

    initChart() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        this.chartData = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    label: 'First Dataset',
                    data: [65, 59, 80, 81, 56, 55, 40],
                    fill: false,
                    backgroundColor: documentStyle.getPropertyValue('--bluegray-700'),
                    borderColor: documentStyle.getPropertyValue('--bluegray-700'),
                    tension: .4
                },
                {
                    label: 'Second Dataset',
                    data: [28, 48, 40, 19, 86, 27, 90],
                    fill: false,
                    backgroundColor: documentStyle.getPropertyValue('--green-600'),
                    borderColor: documentStyle.getPropertyValue('--green-600'),
                    tension: .4
                }
            ]
        };

        this.chartOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                }
            }
        };
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
