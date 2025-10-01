import { Component, OnInit, ViewChild, AfterViewInit, inject } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
  FormControl,
  AbstractControl
} from '@angular/forms';
import { NgbCalendar, NgbDatepickerModule, NgbDateStruct, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { ApexOptions, NgApexchartsModule } from "ng-apexcharts";
import { FeatherIconDirective } from '../../../core/feather-icon/feather-icon.directive';
import { ThemeCssVariableService, ThemeCssVariablesType } from '../../../core/services/theme-css-variable.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { ReporteService } from '../../../service/reporte.service';
import { HttpErrorResponse } from '@angular/common/http';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { ChartData, ChartConfiguration } from 'chart.js';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';

import Swal from 'sweetalert2';
@Component({
  selector: 'app-reportes',
  imports: [
    CommonModule,
    NgbDropdownModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbDatepickerModule,
    NgApexchartsModule,
    FeatherIconDirective,
    NgSelectModule,
    NgbAccordionModule,
    BaseChartDirective

  ],
  providers: [
    provideCharts(withDefaultRegisterables())
  ],
  templateUrl: './reportes.component.html',
  styleUrl: './reportes.component.scss'
})
export class ReportesComponent {
  public dependencia: any[] = [];
  generoSlct = [
    { id: 'Hombre', name: 'Masculino' },
    { id: 'Mujer', name: 'Femenino' }
  ];
  selectedDependencia: string | null = null;
  selectedGenero: string | null = null;
  data: any[] = [];
  dependencias: any[] = [];
  primerasDependencias: any;
  segundasDependencias: any;
  tHombres = 0;
  tMujeres = 0;
  accordionOpen = true;
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

  constructor(private _reporteService: ReporteService) { }

  ngOnInit(): void {
    this.getDependencias();
    this.showAllData();
    this.getTotalesDep();
  }

  getChartData(pregunta: any): ChartData<'bar'> {
    const opciones = pregunta?.opciones || [];
    return {
      labels: opciones.map((o: any) => o.nombreOpcion),
      datasets: [
        {
          label: 'Total de respuestas',
          data: opciones.map((o: any) => o.totalRespuestas),
          backgroundColor: '#42A5F5'
        }
      ]
    };
  }

  getDependencias() {
    this._reporteService.getDependencias().subscribe({
      next: (response) => {
        this.dependencia = response.data
      },
      error: (e: HttpErrorResponse) => {
        console.error(e);
      },
    });
  }

  getResultados() {
    if (!this.selectedDependencia && !this.selectedGenero) {
      Swal.fire({
        position: "center",
        icon: "warning",
        title: "¡Atención!",
        text: `Selecciona almenos una opción`,
        showConfirmButton: false,
        timer: 2000
      });
      return;
    }
    this.accordionOpen = false;
    this.data = [];

    const valores = {
      'id_dependencia': this.selectedDependencia,
      'genero': this.selectedGenero
    }
    this._reporteService.getCuestionariosDep(valores).subscribe({
      next: (response) => {
        this.data = response.data;
        setTimeout(() => {
          this.accordionOpen = true;
        });
      },
      error: (e: HttpErrorResponse) => {
        console.error(e);
      },
    });
  }

  getExcelF() {
    if (!this.selectedDependencia) {
      Swal.fire({
        position: "center",
        icon: "warning",
        title: "¡Atención!",
        text: `Selecciona una dependencia`,
        showConfirmButton: false,
        timer: 2000
      });
      return;
    }
    console.log('si');

    const valores = {
      'id_dependencia': this.selectedDependencia
    }

    this._reporteService.getExcelF(valores).subscribe({
      next: (response: Blob) => {

        const dependenciaSeleccionada = this.dependencia.find(
          d => d.id_Dependencia === this.selectedDependencia
        );

        const nombreDependencia = dependenciaSeleccionada?.nombre_completo || 'sin_nombre';
        const nombreArchivo = `reporte_${nombreDependencia}.xlsx`;
        const blob = new Blob([response], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = nombreDependencia + `_contestados.xlsx`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (e: HttpErrorResponse) => {
        console.error('Error al descargar Excel:', e.error?.msg || e);
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Ocurrió un error al descargar el archivo.',
          showConfirmButton: false,
          timer: 2000
        });
      }
    });
  }





















  getTotalesDep() {
    this._reporteService.getTotalesDep().subscribe({
      next: (response) => {
        this.dependencias = response.data;
        this.primerasDependencias = this.dependencias.slice(0, 4);
        this.segundasDependencias = this.dependencias.slice(4);
        this.dependencias.forEach((dep: any) => {
          if (dep.hombres) {
            this.tHombres = this.tHombres + dep.hombres;
          }
          if (dep.mujeres) {
            this.tMujeres = this.tMujeres + dep.mujeres;
          }
        });
      },
      error: (e: HttpErrorResponse) => {
        console.error(e);
      },
    });

  }

  showAllData() {
    this.accordionOpen = false;
    this.data = [];
    this._reporteService.getCuestionarios().subscribe({
      next: (response) => {
        this.data = response.data;
        setTimeout(() => {
          this.accordionOpen = true;
        });
      },
      error: (e: HttpErrorResponse) => {
        console.error(e);
      },
    });
  }
}
