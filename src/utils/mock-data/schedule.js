import { add, set, sub } from 'date-fns';

const COLOR_OPTIONS = [
  '#00AB55', // theme.palette.primary.main,
  '#1890FF', // theme.palette.info.main,
  '#94D82D', // theme.palette.success.main,
  '#FFC107', // theme.palette.warning.main,
  '#FF4842', // theme.palette.error.main
  '#04297A', // theme.palette.info.darker
  '#7A0C2E' // theme.palette.error.darker
];

export const scheduleData = [
  {
    id: '001',
    cageId: 'CA001',
    title: 'Feed Bird',
    description: 'Feeding for CA001',
    foodType: 'Product 1',
    start: sub(new Date(), { days: 1, hours: 0, minutes: 45 }),
    end: sub(new Date(), { days: 1, hours: 0, minutes: 35 }),
    foodQuantity: '100 grams',
    staffId: 'STA001',
    status: 'Completed',
    textColor: COLOR_OPTIONS[2],
    feedingRegimen: "None"
  },
  {
    id: '002',
    cageId: 'CA001',
    title: 'Feed Bird',
    description: 'Feeding for CA001',
    foodType: 'Product 2',
    start: sub(new Date(), { days: 0, hours: 0, minutes: 35 }),
    end: sub(new Date(), { days: 0, hours: 0, minutes: 45 }),
    foodQuantity: '120 grams',
    staffId: 'STA001',
    status: 'Pending',
    textColor: COLOR_OPTIONS[1],
    feedingRegimen: ""
  },
  {
    id: '003',
    cageId: 'CA002',
    title: 'Feed Bird',
    description: 'Feeding for CA002',
    foodType: 'Product 1',
    start: sub(new Date(), { days: 1, hours: 0, minutes: 45 }),
    end: sub(new Date(), { days: 1, hours: 0, minutes: 35 }),
    foodQuantity: '90 grams',
    staffId: 'STA002',
    status: 'Completed',
    textColor: COLOR_OPTIONS[2],
    feedingRegimen: "None"
  },
  {
    id: '004',
    cageId: 'CA002',
    title: 'Feed Bird',
    foodType: 'Product 3',
    description: 'Feeding for CA002',
    start: sub(new Date(), { days: 0, hours: 0, minutes: 35 }),
    end: sub(new Date(), { days: 0, hours: 0, minutes: 45 }),
    foodQuantity: '110 grams',
    staffId: 'STA002',
    status: 'Pending',
    textColor: COLOR_OPTIONS[1],
    feedingRegimen: ""
  },
  {
    id: '005',
    cageId: 'CA003',
    title: 'Feed Bird',
    description: 'Feeding for CA003',
    foodType: 'Product 2',
    start: sub(new Date(), { days: 1, hours: 0, minutes: 45 }),
    end: sub(new Date(), { days: 1, hours: 0, minutes: 35 }),
    foodQuantity: '80 grams',
    staffId: 'STA003',
    status: 'Completed',
    textColor: COLOR_OPTIONS[2],
    feedingRegimen: "None"
  },
  {
    id: '006',
    cageId: 'CA003',
    title: 'Feed Bird',
    description: 'Feeding for CA003',
    foodType: 'Product 1',
    start: sub(new Date(), { days: 0, hours: 0, minutes: 35 }),
    end: sub(new Date(), { days: 0, hours: 0, minutes: 45 }),
    foodQuantity: '95 grams',
    staffId: 'STA003',
    status: 'Pending',
    textColor: COLOR_OPTIONS[1],
    feedingRegimen: ""
  },
  {
    id: '007',
    cageId: 'CA004',
    title: 'Feed Bird',
    description: 'Feeding for CA004',
    foodType: 'Product 3',
    start: sub(new Date(), { days: 1, hours: 0, minutes: 45 }),
    end: sub(new Date(), { days: 1, hours: 0, minutes: 35 }),
    foodQuantity: '110 grams',
    staffId: 'STA004',
    status: 'Completed',
    textColor: COLOR_OPTIONS[2],
    feedingRegimen: "None"
  },
  {
    id: '008',
    cageId: 'CA004',
    title: 'Feed Bird',
    description: 'Feeding for CA004',
    foodType: 'Product 2',
    start: sub(new Date(), { days: 0, hours: 0, minutes: 35 }),
    end: sub(new Date(), { days: 0, hours: 0, minutes: 45 }),
    foodQuantity: '85 grams',
    staffId: 'STA004',
    status: 'Pending',
    textColor: COLOR_OPTIONS[1],
    feedingRegimen: ""
  },
  {
    id: '009',
    cageId: 'CA005',
    title: 'Feed Bird',
    description: 'Feeding for CA005',
    foodType: 'Product 1',
    start: sub(new Date(), { days: 1, hours: 0, minutes: 45 }),
    end: sub(new Date(), { days: 1, hours: 0, minutes: 35 }),
    foodQuantity: '100 grams',
    staffId: 'STA005',
    status: 'Completed',
    textColor: COLOR_OPTIONS[2],
    feedingRegimen: "None"
  },
  {
    id: '010',
    cageId: 'CA005',
    title: 'Feed Bird',
    description: 'Feeding for CA005',
    foodType: 'Product 3',
    start: sub(new Date(), { days: 0, hours: 0, minutes: 35 }),
    end: sub(new Date(), { days: 0, hours: 0, minutes: 45 }),
    foodQuantity: '120 grams',
    staffId: 'STA005',
    status: 'Pending',
    textColor: COLOR_OPTIONS[1],
    feedingRegimen: ""
  }
];
