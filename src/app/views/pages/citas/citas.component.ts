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
import { CitasService } from '../../../service/citas.service';
import { UserService } from '../../../core/services/user.service';



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
  fechaCitaEnvio: string = '';
  fechaFormateadaM: string = '';
  personaSeleccionada: any = null;
  datosCita: any = null;
  modalRef: NgbModalRef;
  viewState: 'lista' | 'enviar-link' | 'atender' = 'lista';
  mostrarCalendario = false;

  horarios: {
    horario_id: number;
    horario_texto: string;
    sedes: { sede_id: number; sede_texto: string }[];
  }[] = [];
  horaSeleccionada2: number | null = null;
  sedeSeleccionada: number | null = null;
  sedesDisponibles2: Array<{ sede_id: number; sede_texto: string }> = [];
  correoUsuario: string = '';
  correoConfirmado: string = '';
  telefonoUsuario: string = '';
  telefonoConfirmado: string = '';
  enviandoRegistro: number | null = null;


  public _citasService = inject(CitasService);

  constructor(private fb: FormBuilder, private modalService: NgbModal, private router: Router, private _userService: UserService) {
    this.formModal = this.fb.group({
      textLink: [''],
      descripcion: ['']
    });
  }



  ngOnInit(): void {
    this.currentUser = this._userService.currentUserValue;
     this._citasService.getcitaRFC(this.currentUser.rfc).subscribe({
      next: (response: any) => {
         this.datosCita = response
         if(response.citas.length > 0){
            this.mostrarCalendario = true;
         }
      },
      error: (e: HttpErrorResponse) => {
        if (e.status == 400) {
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: "¡Atención!",
            text: "Ya tienes una cita activa",
            showConfirmButton: false,
            timer: 5000
          });
          if (this.modalRef) {
            this.modalRef.close('');
          }
        } else {
          const msg = e.error?.msg || 'Error desconocido';
          console.error('Error del servidor:', msg);
        }
      }
    });
  }

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    locale: 'es',
    initialDate: '2025-10-10',
    dateClick: this.onDateClick.bind(this),
    buttonText: {
      today: 'Hoy',
      month: 'Mes',
      week: 'Semana',
      day: 'Día',
      list: 'Lista'
    },
    weekends: true,
    editable: false,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,

    validRange: {
      start: '2025-10-10',
      end: '2025-10-11' 
    },

    dayCellDidMount: (info) => {
      const dateStr = info.date.toISOString().split('T')[0];
      if (dateStr !== '2025-10-10') {
        info.el.style.backgroundColor = '#f8f9fa';
        info.el.style.pointerEvents = 'none';
        info.el.style.opacity = '0.3';
      }
    }
  };

  onDateClick(arg: DateClickArg): void {
    this.selectedDate = arg.date;
    this.fechaCitaEnvio =  arg.dateStr;

    this.fechaFormateadaM = this.selectedDate.toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
 
    this._citasService.getCitas(this.fechaCitaEnvio).subscribe({
      next: (response: any) => {
         console.log()
        this.horarios = Array.isArray(response.horarios) ? response.horarios : [];
         console.log(this.horarios)
      },
      error: (e: HttpErrorResponse) => {
        const msg = e.error?.msg || 'Error desconocido'; 1
        console.error('Error del servidor:', msg);
      }
    });


    this.abrirModal(null);
  }

   onHoraChange() {
      const horario = this.horarios.find(h => h.horario_id === this.horaSeleccionada2);
      this.sedesDisponibles2 = (horario?.sedes ?? []).map(sede => {
        if (typeof sede === 'string') {
          return { sede_id: 0, sede_texto: sede };
        }
        return sede;
      });

      this.sedeSeleccionada = null;
    }

  guardarSeleccion() {

    this.currentUser = this._userService.currentUserValue;
    const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!correoRegex.test(this.correoUsuario)) {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: '¡Error!',
        text: 'El correo electrónico no es válido.',
        showConfirmButton: false,
        timer: 5000
      });
      return;
    }

    const telefonoRegex = /^\d{10}$/;
    if (!telefonoRegex.test(this.telefonoUsuario)) {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: '¡Error!',
        text: 'El teléfono debe contener exactamente 10 dígitos.',
        showConfirmButton: false,
        timer: 5000
      });
      return;
    }

    if (this.correoUsuario !== this.correoConfirmado) {
      Swal.fire({
            position: 'center',
            icon: 'error',
            title: "¡Error!",
            text: "Los correos no coinciden.",
            showConfirmButton: false,
            timer: 5000
          });
      return;
    }

    if (this.telefonoUsuario !== this.telefonoConfirmado) {
      Swal.fire({
            position: 'center',
            icon: 'error',
            title: "¡Error!",
            text: "Los teléfonos no coinciden.",
            showConfirmButton: false,
            timer: 5000
          });
      return;
    }


    const datos = {
      fecha_cita: this.fechaCitaEnvio,
      horario_id: this.horaSeleccionada2,
      sede_id: this.sedeSeleccionada,
      rfc: this.currentUser.rfc,
      correo: this.correoUsuario,
      telefono: this.telefonoUsuario
    };
 
    this.enviandoRegistro = 1;

    this._citasService.saveCita(datos).subscribe({
      next: (response: any) => {
         this.enviandoRegistro = null;
         if (response.status == 200) {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: "¡Cita registrada!",
            text: "Antes de acudir, descarga e imprime tu comprobante de cita.",
            showConfirmButton: false,
            timer: 5000
          });
          this._citasService.getcitaRFC(this.currentUser.rfc).subscribe({
            next: (response: any) => {
              this.datosCita = response
              if(response.citas.length > 0){
                  this.mostrarCalendario = true;
              }
            },
            error: (e: HttpErrorResponse) => {
              if (e.status == 400) {
                Swal.fire({
                  position: 'center',
                  icon: 'error',
                  title: "¡Atención!",
                  text: "Ya tienes una cita activa",
                  showConfirmButton: false,
                  timer: 5000
                });
                if (this.modalRef) {
                  this.modalRef.close('');
                }
              } else {
                const msg = e.error?.msg || 'Error desconocido';
                console.error('Error del servidor:', msg);
              }
            }
          });
          this.mostrarCalendario = true;
          this.modalRef.close();   
        }
        
      },
      error: (e: HttpErrorResponse) => {
        this.enviandoRegistro = null;
        if (e.status == 400) {
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: "¡Atención!",
            text: "Ya tienes una cita activa",
            showConfirmButton: false,
            timer: 5000
          });
          if (this.modalRef) {
            this.modalRef.close('');
          }
        } else {
          const msg = e.error?.msg || 'Error desconocido';
          console.error('Error del servidor:', msg);
        }
      }
    });

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

