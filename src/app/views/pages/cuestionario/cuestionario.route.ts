import { Routes } from "@angular/router";

export default [
    {
        path: '',
        loadComponent: () => import('./cuestionario.component').then(c => c.CuestionarioComponent)
    }
] as Routes;