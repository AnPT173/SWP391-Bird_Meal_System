import { cagesData } from 'src/utils/mock-data/cage'
import mock from './mock'
import mockData from 'src/utils/mock-data'
import { birdsData } from 'src/utils/mock-data/bird'

let CageCard = cagesData

mock.onGet('/api/cage/cards').reply(200, { CageCard})

let BirdCard = birdsData

mock.onGet('api/cage/birds').reply(200, {BirdCard})