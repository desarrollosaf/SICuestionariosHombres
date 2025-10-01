import { Routes } from "@angular/router";

export default [
    {
        path: '',
        loadComponent: () => import('./reportes.component').then(c => c.ReportesComponent)
    },
    {
        path: 'servidores-publicos',
        loadComponent: () => import('./servidores-publicos/servidores-publicos.component').then(c => c.ServidoresPublicosComponent)
    },
] as Routes;