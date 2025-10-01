import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ColumnMode, DatatableComponent, NgxDatatableModule } from '@siemens/ngx-datatable';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { FullCalendarComponent } from '@fullcalendar/angular';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import { RouterOutlet } from '@angular/router';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core'; // useful for typechecking
import dayGridPlugin from '@fullcalendar/daygrid';


@Component({
  selector: 'app-citas',
  imports: [NgxDatatableModule, CommonModule, RouterModule, FormsModule,
    ReactiveFormsModule, NgbTooltipModule, FullCalendarModule, ],
  templateUrl: './citas.component.html',
  styleUrl: './citas.component.scss'
})
export class CitasComponent {
  @ViewChild('table') table: DatatableComponent;
  @ViewChild('fullcalendar') calendarComponent: FullCalendarComponent;
  @ViewChild('xlModal', { static: true }) xlModal!: TemplateRef<any>;

   formModal: FormGroup;
  showModal = false;
  selectedDate: Date | null = null;
  fechaFormat: any;
  fechaModal: any;
  selectedHour: string = '';
  fechaSeleccionada: any;
  horaSeleccionada: string = '';
  mensajeDisponibilidad: string = '';
  numeroLugares: number = 0;
  currentUser: any;
  banderaCita: number = 0;
  fechaHoraActual: string = '';
  fechaFormateadaM: string = '';
  personaSeleccionada: any = null;
  modalRef: NgbModalRef;
  viewState: 'lista' | 'enviar-link' | 'atender' = 'lista';

  constructor(private fb: FormBuilder, private modalService: NgbModal, private router: Router) {
    this.formModal = this.fb.group({
      textLink: [''],
      descripcion: ['']
    });
  }

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    events: [],
    locale: 'es',
    // dateClick: this.onDateClick.bind(this),
    dateClick: this.onDateClick.bind(this),
    dayCellDidMount: (info) => {
      const today = new Date();
      const cellDate = info.date;
    },
    buttonText: {
      today: 'Hoy',
      month: 'Mes',
      week: 'Semana',
      day: 'Día',
      list: 'Lista'
    },
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true
  };

  onDateClick(arg: DateClickArg): void {
    console.log('Día clicado:', arg.dateStr); 
    this.selectedDate = arg.date;

    this.fechaFormateadaM = this.selectedDate.toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    this.abrirModal(null);
  }


  onEventClick(arg: any): void {
    console.log('holi')
    const evento = arg.event;
    const today = new Date();
    const clickedDate = evento.start;
    this.selectedDate = evento.start;
    this.fechaSeleccionada = evento.start;
    const year = clickedDate.getFullYear();
    const month = String(clickedDate.getMonth() + 1).padStart(2, '0'); // Mes va de 0 a 11
    const day = String(clickedDate.getDate()).padStart(2, '0');

    this.fechaFormat = `${year}-${month}-${day}`;
    this.fechaFormateadaM = this.fechaSeleccionada.toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    
    /*this._citasService.getCitas(this.fechaFormat).subscribe({
      next: (response: any) => {
        this.originalData = [...response.citas];
        this.temp = [...this.originalData];
        this.filteredCount = this.temp.length;
        this.setPage({ offset: 0 });
        this.loading = false;
      },
      error: (e: HttpErrorResponse) => {
        const msg = e.error?.msg || 'Error desconocido'; 1
        console.error('Error del servidor:', msg);
      }
    });*/
    this.abrirModal(1)
  }

  abrirModal(persona: any) {
    this.personaSeleccionada = persona;
    this.modalRef = this.modalService.open(this.xlModal, { size: 'xl' });
    setTimeout(() => {
      const elementoDentroDelModal = document.getElementById('focus-target');
      elementoDentroDelModal?.focus();
      if (this.table) {
        this.table.recalculate();
      }
    }, 400);
    this.modalRef.result.then((result) => {
      this.limpiaf()
      this.viewState = 'lista';
    }).catch((res) => {
      this.limpiaf()
      this.viewState = 'lista';
    });
  }

  limpiaf() {
    ['textLink', 'descripcion'
    ].forEach(campo => {
      const control = this.formModal.get(campo);
      control?.setValue(null);
      control?.markAsPristine();
      control?.markAsUntouched();
    });
    this.formModal.patchValue({
      textLink: '',
      descripcion: ''
    });
  }

}

