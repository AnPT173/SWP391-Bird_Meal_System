import { birdsData } from 'src/utils/mock-data/bird';
import mock from './mock'

const BirdCard = birdsData

mock.onGet('api/cage/birds').reply(200, {BirdCard})

mock.onGet('/api/birds/:birdId').reply((config) => {
    const { birdId } = config.params;
    const selectedBird = birdsData.find(bird => bird.birdId === birdId);
    return [200, selectedBird];
  });
  mock.onPost('/api/birds').reply((request) => {
    const newBird = JSON.parse(request.data);
    birdsData.push(newBird);
    return [200, newBird]; 
  });