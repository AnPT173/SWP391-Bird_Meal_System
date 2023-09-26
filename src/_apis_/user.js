import { random, sample } from 'lodash';
// utils
import mock from './mock';
import mockData from '../utils/mock-data';

// ----------------------------------------------------------------------

mock.onGet('/api/user/profile').reply(() => {
  const profile = {
    id: mockData.id(1),
    cover: mockData.image.cover(1),
    position: 'UI Designer',
    follower: random(99999),
    following: random(99999),
    quote: 'Tart I love sugar plum I love oat cake. Sweet roll caramels I love jujubes. Topping cake wafer..',
    country: mockData.address.country(1),
    email: mockData.email(1),
    company: mockData.company(1),
    school: mockData.company(2),
    role: 'Manager',
    facebookLink: `https://www.facebook.com/caitlyn.kerluke`,
    instagramLink: `https://www.instagram.com/caitlyn.kerluke`,
    linkedinLink: `https://www.linkedin.com/in/caitlyn.kerluke`,
    twitterLink: `https://www.twitter.com/caitlyn.kerluke`
  };

  return [200, { profile }];
});

// ----------------------------------------------------------------------

mock.onGet('/api/user/all').reply(() => {
  const users = [...Array(24)].map((_, index) => ({
    id: mockData.id(index),
    cover: mockData.image.cover(index),
    name: mockData.name.fullName(index),
    follower: random(9999),
    following: random(9999),
    totalPost: random(9999),
    position: mockData.role(index)
  }));

  return [200, { users }];
});

// ----------------------------------------------------------------------

mock.onGet('/api/user/manage-users').reply(() => {
  const users = [...Array(24)].map((_, index) => ({
    id: mockData.id(index),
    avatarUrl: mockData.image.avatar(index),
    name: mockData.name.fullName(index),
    email: mockData.email(index),
    phoneNumber: mockData.phoneNumber(index),
    address: '908 Jack Locks',
    country: mockData.address.country(index),
    state: 'Virginia',
    city: 'Rancho Cordova',
    zipCode: '85807',
    company: mockData.company(index),
    isVerified: mockData.boolean(index),
    status: sample(['active', 'banned']) || 'active',
    role: mockData.role(index)
  }));

  return [200, { users }];
});
