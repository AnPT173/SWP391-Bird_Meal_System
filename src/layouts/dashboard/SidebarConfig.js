// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import Label from '../../components/Label';
import SvgIconStyle from '../../components/SvgIconStyle';

// ----------------------------------------------------------------------

const getIcon = (name) => (
  <SvgIconStyle src={`/static/icons/navbar/${name}.svg`} sx={{ width: '100%', height: '100%' }} />
);

const ICONS = {
  blog: getIcon('ic_blog'),
  cart: getIcon('ic_cart'),
  chat: getIcon('ic_chat'),
  mail: getIcon('ic_mail'),
  user: getIcon('ic_user'),
  kanban: getIcon('ic_kanban'),
  banking: getIcon('ic_banking'),
  calendar: getIcon('ic_calendar'),
  ecommerce: getIcon('ic_ecommerce'),
  analytics: getIcon('ic_analytics'),
  dashboard: getIcon('ic_dashboard'),
  booking: getIcon('ic_booking'),
  setting: getIcon('ic_setting'),
  report: getIcon('ic_report'),
  storage: getIcon('ic_storage'),
  task: getIcon('ic_task'),
  cage: getIcon('ic_cage')
};

export const staffSidebar = [
  {
    items: [
      {
        title: 'Dashboard',
        path: PATH_DASHBOARD.general.app,
        icon: ICONS.dashboard
      },
      {
        title: 'Cages',
        path: PATH_DASHBOARD.cages.cards,
        icon: ICONS.cage,
      },
      { title: 'Schedule', path: PATH_DASHBOARD.calendar, icon: ICONS.calendar },
      { title: 'Food', path: PATH_DASHBOARD.food.species, icon: ICONS.cart },
      {
        title: 'Storage',
        path: PATH_DASHBOARD.user.list,
        icon: ICONS.storage
      }
    ]
  }
];

export const managerSidebar = [
  {
    items: [
      {
        title: 'Dashboard',
        path: PATH_DASHBOARD.general.app,
        icon: ICONS.dashboard
      },
      {
        title: 'Cages',
        path: PATH_DASHBOARD.cages.cards,
        icon: ICONS.cage,
      },
      { title: 'Schedule', path: PATH_DASHBOARD.calendar, icon: ICONS.calendar },
      { title: 'Task', path: PATH_DASHBOARD.task.root, icon: ICONS.cart },
      { title: 'Food', path: PATH_DASHBOARD.food.card, icon: ICONS.cart },
      {
        title: 'Storage',
        path: PATH_DASHBOARD.food.list,
        icon: ICONS.storage
      },
      {
        title: 'Report',
        path: PATH_DASHBOARD.mail.root,
        icon: ICONS.report
      }
    ]
  }
];
