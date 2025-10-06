import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ColumnMode, DatatableComponent, NgxDatatableModule } from '@siemens/ngx-datatable';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { CitasService } from '../../../service/citas.service';
import { FullCalendarComponent } from '@fullcalendar/angular';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import { RouterOutlet } from '@angular/router';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core'; // useful for typechecking
import dayGridPlugin from '@fullcalendar/daygrid';
import { UserService } from '../../../core/services/user.service';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { ChartData, ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-detalle-citas',
  imports: [NgxDatatableModule, CommonModule, RouterModule, FormsModule,
    ReactiveFormsModule, NgbTooltipModule, FullCalendarModule, NgbAccordionModule,],
  templateUrl: './reportes.component.html',
  styleUrl: './reportes.component.scss'
})
export class ReportesComponent {
  formModal: FormGroup;
  public _citasService = inject(CitasService);
  public _userService = inject(UserService);
  originalData: any[] = [];
  temp: any[] = [];
  rows: any[] = [];
  page: number = 0;
  pageSize: number = 10;
  filteredCount: number = 0;
  loading: boolean = true;
  personaSeleccionada: any = null;
  modalRef: NgbModalRef;
  accordionOpen = true;
  data: { horarios: Record<string, any[]> } = { horarios: {} };
  chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    animation: {
      duration: 0
    },
    plugins: {
      legend: { display: false }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { precision: 0 }
      }
    }
  };

  formCitas: FormGroup;
  showModal = false;
  selectedDate: Date | null = null;
  fechaFormat: any;
  rfcUser: any;
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
  viewState: 'lista' | 'enviar-link' | 'atender' = 'lista';
  selectedRow: any = null;
  tpendientes: any;
  tatendidos: any;
  visibleHorarios: { [key: string]: boolean } = {};

  descargandoPDF: number | null = null;
  descargandoExcel: number | null = null;

  @ViewChild('table') table: DatatableComponent;
  @ViewChild('fullcalendar') calendarComponent: FullCalendarComponent;
  @ViewChild('xlModal', { static: true }) xlModal!: TemplateRef<any>;
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
    eventClick: this.onEventClick.bind(this),
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

  ngOnInit(): void {
    this.getAllCitas();
    this.getHoy();
    this.actualizarFechaHora();
    setInterval(() => {
    this.actualizarFechaHora();
    }, 1000);
  }

 actualizarFechaHora() {
  const ahora = new Date();
  this.fechaHoraActual = ahora.toLocaleString('es-MX', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}
  getHoy(){
    /*this._citasService.getHoy().subscribe({
      next: (response: any) => {
        this.tatendidos = response.citas[0].atendidas;
        this.tpendientes = response.citas[0].pendientes
      },
      error: (e: HttpErrorResponse) => {
        const msg = e.error?.msg || 'Error desconocido'; 1
        console.error('Error del servidor:', msg);
      }
    });*/
  }

  getAllCitas() {
    this._citasService.groupCitas().subscribe({
      next: (response: any) => {
        console.log(response.citas)
        if (response.citas.length > 0) {

          response.citas.forEach((cita: any) => {
            console.log(cita)
            //const totalDia = cita.sedes.horarios.
            const fechaHora = `${cita.fecha_cita}T00:00:00`;
            const nuevoEvento = {
              title: `Ver citas, total: ${cita.total_citas}`,
              start: fechaHora,
              allDay: false,
              backgroundColor: '#dc3545',  // Rojo
              borderColor: '#bd2130',
              textColor: '#fff'
            };
            if (Array.isArray(this.calendarOptions.events)) {
              this.calendarOptions.events = [...this.calendarOptions.events, nuevoEvento];
            } else {
              this.calendarOptions.events = [nuevoEvento];
            }
            console.log( this.calendarOptions.events)
          });
        }
      },
      error: (e: HttpErrorResponse) => {
        const msg = e.error?.msg || 'Error desconocido'; 1
        console.error('Error del servidor:', msg);
      }
    });
  }
  // onDateClick(arg: DateClickArg) {
  //   const today = new Date();
  //   console.log(today)
  //   const clickedDate = arg.date;
  //   if (clickedDate < new Date(today.setHours(0, 0, 0, 0))) {
  //     return;
  //   }
  //   this.selectedDate = clickedDate;
  //   this.fechaSeleccionada = clickedDate;
  //   const year = clickedDate.getFullYear();
  //   const month = String(clickedDate.getMonth() + 1).padStart(2, '0'); // Mes va de 0 a 11
  //   const day = String(clickedDate.getDate()).padStart(2, '0');

  //   this.fechaFormat = `${year}-${month}-${day}`;
  //   console.log(this.fechaFormat )
  //   this._citasService.getCitas(this.fechaFormat).subscribe({
  //     next: (response: any) => {
  //       this.originalData = [...response.citas];
  //       this.temp = [...this.originalData];
  //       this.filteredCount = this.temp.length;
  //       this.setPage({ offset: 0 });
  //       this.loading = false;
  //     },
  //     error: (e: HttpErrorResponse) => {
  //       const msg = e.error?.msg || 'Error desconocido';1
  //       console.error('Error del servidor:', msg);
  //     }
  //   });
  //   this.abrirModal(1)
  // }


  onEventClick(arg: any): void {
  const evento = arg.event;
  const clickedDate = evento.start;
  this.selectedDate = clickedDate;
  this.fechaSeleccionada = clickedDate;

  const year = clickedDate.getFullYear();
  const month = String(clickedDate.getMonth() + 1).padStart(2, '0');
  const day = String(clickedDate.getDate()).padStart(2, '0');
  this.fechaFormat = `${year}-${month}-${day}`;

  this.fechaFormateadaM = clickedDate.toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  this.rfcUser = this._userService.currentUserValue?.rfc;


  this.loading = true;

  this._citasService.getCitasFecha(this.fechaFormat, this.rfcUser).subscribe({
    next: (response: any) => {
      console.log('horarios citas:', response);
      this.data = {
        horarios: response.horarios
      };
      console.log(this.data)

    },
    error: (e: HttpErrorResponse) => {
      const msg = e.error?.msg || 'Error desconocido';
      console.error('Error del servidor:', msg);
      this.loading = false;
    }
  });

  this.abrirModal(1);
}


  verEnviarLink(row: any) {
    this.selectedRow = row;
    this.viewState = 'enviar-link';
  }




  toggleHorario(horario: string): void {
    this.visibleHorarios[horario] = !this.visibleHorarios[horario];
  }

  isVisible(horario: string): boolean {
    return !!this.visibleHorarios[horario];
  }




  setPage(pageInfo: any) {
    this.page = pageInfo.offset;
    const start = this.page * this.pageSize;
    const end = start + this.pageSize;
    this.rows = this.temp.slice(start, end);
  }

  updateFilter(event: any) {
    const val = (event.target?.value || '').toLowerCase();
    this.temp = this.originalData.filter((row: any) => {
      return Object.values(row).some((field) => {
        return field && field.toString().toLowerCase().includes(val);
      });
    });

    this.filteredCount = this.temp.length;
    this.setPage({ offset: 0 });
  }


  enviarDatos(datos: any): void {
    if (this.formModal.value.textLink == '' || this.formModal.value.descripcion == '') {
      Swal.fire({
        position: "center",
        icon: "warning",
        title: "¡Atención!",
        text: `Debe llenar los campos.`,
        showConfirmButton: false,
        timer: 2000
      });
    } else {
      const data = {
        enlace: this.formModal.value.textLink,
        texto: this.formModal.value.descripcion,
        rfc: datos.rfc,
        citaid: datos.id
      }

      /*this._citasService.sendMsg(data).subscribe({
        next: (response: any) => {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "¡Correcto!",
            text: `Correo enviado correctamente.`,
            showConfirmButton: true,
          }).then((result) => {
            if (result.isConfirmed) {
              if (this.modalRef) {
                this.modalRef.close('');
              }
              const currentUrl = this.router.url;
              this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                this.router.navigate([currentUrl]);
              });
            } else if (result.isDenied) {
            }
          });
        },
        error: (e: HttpErrorResponse) => {
          const msg = e.error?.msg || 'Error desconocido';
          console.error('Error del servidor:', msg);
        }
      });*/
    }
  }

  sendAtendido(persona: any) {
    const id = persona.id;
    Swal.fire({
      position: 'center',
      icon: 'warning',
      title: '¿Está seguro?',
      text: 'Se marcará como atendido',
      showDenyButton: true,
      confirmButtonText: 'Confirmar',
      denyButtonText: 'Cancelar',
      customClass: {
        confirmButton: 'swal2-confirm btn btn-success me-2',
        denyButton: 'swal2-cancel btn btn-warning'
      },
      buttonsStyling: false
    }).then((result) => {
      if (result.isConfirmed) {
        /*this._citasService.atendercita(id).subscribe({
          next: (response: any) => {
            Swal.fire({
              position: "center",
              icon: "success",
              title: "¡Correcto!",
              text: `Se marcó como atendido.`,
              showConfirmButton: true,
            }).then((result) => {
              if (result.isConfirmed) {
                const currentUrl = this.router.url;
                this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                  this.router.navigate([currentUrl]);
                });
              } else if (result.isDenied) {
              }
            });
          },
          error: (e: HttpErrorResponse) => {
            const msg = e.error?.msg || 'Error desconocido';
            console.error('Error del servidor:', msg);
          }
        });*/
      } else if (result.isDenied) {
      }
    });

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

  descargarPDF(sedeID: number) {
  this.descargandoPDF = sedeID; // Inicia spinner

  this._citasService.generarPDF(this.fechaFormat, sedeID).subscribe(
    (res: Blob) => {
      const blob = new Blob([res], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'reporte-citas.pdf';
      a.click();
      window.URL.revokeObjectURL(url);
      this.descargandoPDF = null; // Finaliza spinner
    },
    (error) => {
      console.error('Error al descargar el PDF', error);
      this.descargandoPDF = null; // Asegura que se reinicie el estado
    }
  );
}



descargarExcel(sedeID: number) {
  this.descargandoExcel = sedeID; // Inicia spinner

  this._citasService.generarEXCEL(this.fechaFormat, sedeID).subscribe(
    (res: Blob) => {
      const blob = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'reporte-citas.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
      this.descargandoExcel = null; 
    },
    (error) => {
      console.error('Error al descargar el Excel', error);
      this.descargandoExcel = null; 
    }
  );
}



}
