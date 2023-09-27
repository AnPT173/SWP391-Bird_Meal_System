import { v4 as uuidv4 } from 'uuid';
// utils
import fakeRequest from '../utils/fakeRequest';
import { verify, sign } from '../utils/jwt';
//
import mock from './mock';

// ----------------------------------------------------------------------

const JWT_SECRET = 'minimal-secret-key';
const JWT_EXPIRES_IN = '5 days';

const users = [
  // {
  //   id: '8864c717-587d-472a-929a-8e5f298024da-0',
  //   displayName: 'Jaydon Frankie',
  //   email: 'demo@minimals.cc',
  //   password: 'demo1234',
  //   photoURL: '/static/mock-images/avatars/avatar_default.jpg',
  //   phoneNumber: '+40 777666555',
  //   country: 'United States',
  //   address: '90210 Broadway Blvd',
  //   state: 'California',
  //   city: 'San Francisco',
  //   zipCode: '94116',
  //   about: 'Praesent turpis. Phasellus viverra nulla ut metus varius laoreet. Phasellus tempus.',
  //   role: 'admin',
  //   isPublic: true
  // },
  {
    id: 'STA001',
    displayName: 'Jaydon Frankie',
    email: 'staff1',
    password: 'demo1234',
    photoURL: '/static/mock-images/avatars/avatar_default.jpg',
    phoneNumber: '+40 777666555',
    country: 'United States',
    address: '90210 Broadway Blvd',
    state: 'California',
    city: 'San Francisco',
    zipCode: '94116',
    about: 'Praesent turpis. Phasellus viverra nulla ut metus varius laoreet. Phasellus tempus.',
    role: 'staff',
    isPublic: true
  },
  {
    id: 'STA002',
    displayName: 'Liam Davis',
    email: 'staff2',
    password: 'demo1234',
    photoURL: '/static/mock-images/avatars/avatar_4.jpg',
    phoneNumber: '+61 1234123412',
    country: 'Australia',
    address: '789 Beach Rd',
    state: 'Sydney',
    city: 'Sydney City',
    zipCode: '2000',
    about: 'Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam.',
    role: 'staff',
    isPublic: true
  },
  {
    id: 'STA003',
    displayName: 'Emma Johnson',
    email: 'staff3',
    password: 'demo1234',
    photoURL: '/static/mock-images/avatars/avatar_3.jpg',
    phoneNumber: '+44 9876543210',
    country: 'United Kingdom',
    address: '456 Park Ave',
    state: 'London',
    city: 'London City',
    zipCode: 'SW1A 1AA',
    about: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem.',
    role: 'staff',
    isPublic: true
  },
  {
    id: 'STA004',
    displayName: 'Oliver Smith',
    email: 'staff4',
    password: 'demo1234',
    photoURL: '/static/mock-images/avatars/avatar_2.jpg',
    phoneNumber: '+1 1234567890',
    country: 'United States',
    address: '123 Main St',
    state: 'New York',
    city: 'New York City',
    zipCode: '10001',
    about: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    role: 'staff',
    isPublic: true
  },
  {
    id: 'STA005',
    displayName: 'Oliver Smith',
    email: 'staff5',
    password: 'demo1234',
    photoURL: '/static/mock-images/avatars/avatar_5.jpg',
    phoneNumber: '+44 1234567890',
    country: 'United Kingdom',
    address: '789 Oak Street',
    state: 'London',
    city: 'London City',
    zipCode: 'SW1A 2BB',
    about: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    role: 'staff',
    isPublic: true
  },
  {
    id: 'MANAGER001',
    displayName: 'Jaydon Frankie',
    email: 'manager',
    password: 'demo1234',
    photoURL: '/static/mock-images/avatars/avatar_default.jpg',
    phoneNumber: '+40 777666555',
    country: 'United States',
    address: '90210 Broadway Blvd',
    state: 'California',
    city: 'San Francisco',
    zipCode: '94116',
    about: 'Praesent turpis. Phasellus viverra nulla ut metus varius laoreet. Phasellus tempus.',
    role: 'manager',
    isPublic: true
  }
];

// ----------------------------------------------------------------------

mock.onPost('/api/account/login').reply(async (config) => {
  try {
    await fakeRequest(1000);

    const { email, password } = JSON.parse(config.data);
    const user = users.find((_user) => _user.email === email);

    if (!user) {
      return [400, { message: 'There is no user corresponding to the email address.' }];
    }

    if (user.password !== password) {
      return [400, { message: 'Wrong password' }];
    }

    const accessToken = sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN
    });

    return [200, { accessToken, user }];
  } catch (error) {
    console.error(error);
    return [500, { message: 'Internal server error' }];
  }
});

// ----------------------------------------------------------------------

mock.onPost('/api/account/register').reply(async (config) => {
  try {
    await fakeRequest(1000);

    const { email, password, firstName, lastName } = JSON.parse(config.data);
    let user = users.find((_user) => _user.email === email);

    if (user) {
      return [400, { message: 'There already exists an account with the given email address.' }];
    }

    user = {
      id: uuidv4(),
      displayName: `${firstName} ${lastName}`,
      email,
      password,
      photoURL: null,
      phoneNumber: null,
      country: null,
      address: null,
      state: null,
      city: null,
      zipCode: null,
      about: null,
      role: 'user',
      isPublic: true
    };

    const accessToken = sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN
    });

    return [200, { accessToken, user }];
  } catch (error) {
    console.error(error);
    return [500, { message: 'Internal server error' }];
  }
});

// ----------------------------------------------------------------------

mock.onGet('/api/account/my-account').reply((config) => {
  try {
    const { Authorization } = config.headers;

    if (!Authorization) {
      return [401, { message: 'Authorization token missing' }];
    }

    const accessToken = Authorization.split(' ')[1];
    const data = verify(accessToken, JWT_SECRET);
    const userId = typeof data === 'object' ? data?.userId : '';
    const user = users.find((_user) => _user.id === userId);

    if (!user) {
      return [401, { message: 'Invalid authorization token' }];
    }

    return [200, { user }];
  } catch (error) {
    console.error(error);
    return [500, { message: 'Internal server error' }];
  }
});
