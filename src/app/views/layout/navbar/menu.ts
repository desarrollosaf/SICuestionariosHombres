import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
  {
    label: 'Cuestionario',
    icon: 'home',
    link: '/cuestionario',
    roles: ['usuario'],
  },
  {
    label: 'Reportes',
    icon: 'mail',
    roles: ['GEN25'],
    subMenus: [
      {
        subMenuItems: [
          {
            label: 'Administrador',
            isTitle: true,
          },
          {
            label: 'Graficas',
            link: '/reportes'
          },
          {
            label: 'Servidores publicos',
            link: '/reportes/servidores-publicos'
          },
        ]
      },
    ]
  },
  
  
];
