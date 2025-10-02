import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
  {
    label: 'Citas',
    icon: 'home',
    link: '/citas',
    roles: ['usuario'],
  },
  {
    label: 'Reportes',
    icon: 'mail',
    roles: ['JS'],
    subMenus: [
      {
        subMenuItems: [
          {
            label: 'Administrador',
            isTitle: true,
          },
          {
            label: 'Citas',
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
