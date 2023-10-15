import { cagesData } from 'src/utils/mock-data/cage'
import mockData from 'src/utils/mock-data'
import { birdsData } from 'src/utils/mock-data/bird'
import mock from './mock'

const CageCard = cagesData

mock.onGet('/api/cage/cards').reply(200, { CageCard})

