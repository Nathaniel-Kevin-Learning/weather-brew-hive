const app = require('../app');
const request = require('supertest');
const { Post, User, Type } = require('../models');
const { createJWT, decryptJWT } = require('../helpers/jwt');
const path = require('path');
const fs = require('fs');
const filePath = path.resolve(__dirname, './Caramel_ice.jpg');

let tokenUser1;
let tokenUser2;

beforeAll(async () => {
  const types = require('../type.json');
  await Type.bulkCreate(types);

  const user = require('../user.json');
  let dataUser = await User.bulkCreate(user, { individualHooks: true });

  let admin = dataUser[0].id;
  let users = dataUser[1].id;
  tokenUser1 = createJWT({ id: admin });
  tokenUser2 = createJWT({ id: users });

  const posts = require('../post.json');
  await Post.bulkCreate(posts);
});

describe('POST /login', () => {
  test('success post /login', async () => {
    const response = await request(app).post('/login').send({
      email: 'user1@example.com',
      password: 'password123',
    });

    const { body, status } = response;
    expect(status).toBe(200);
    expect(body).toBeInstanceOf(Object);
    expect(body).toHaveProperty('token', expect.any(String));
  });

  test('failed post /login no password', async () => {
    const response = await request(app).post('/login').send({
      email: 'user1@example.com',
      password: '',
    });

    const { body, status } = response;
    expect(status).toBe(400);
    expect(body).toBeInstanceOf(Object);
    expect(body).toHaveProperty('message', 'password cannot be empty');
  });

  test('failed post /login no email', async () => {
    const response = await request(app).post('/login').send({
      email: '',
      password: 'password123',
    });

    const { body, status } = response;
    expect(status).toBe(400);
    expect(body).toBeInstanceOf(Object);
    expect(body).toHaveProperty('message', 'email cannot be empty');
  });

  test('failed post /login email not exist in server', async () => {
    const response = await request(app).post('/login').send({
      email: 'test@example.com',
      password: 'password123',
    });

    const { body, status } = response;
    expect(status).toBe(401);
    expect(body).toBeInstanceOf(Object);
    expect(body).toHaveProperty(
      'message',
      'Email does not exist in the database please register first or use gmail login'
    );
  });

  test('failed post /login invalid email or password', async () => {
    const response = await request(app).post('/login').send({
      email: 'user1@example.com',
      password: 'password1234',
    });

    const { body, status } = response;
    expect(status).toBe(401);
    expect(body).toBeInstanceOf(Object);
    expect(body).toHaveProperty('message', 'error invalid email or password');
  });
});
describe('POST /register', () => {
  test('success post /register', async () => {
    const response = await request(app).post('/register').send({
      email: 'user12@example.com',
      password: 'password123',
    });

    const { body, status } = response;
    expect(status).toBe(201);
    expect(body).toBeInstanceOf(Object);
    expect(body).toMatchObject({
      email: 'user12@example.com',
      id: 5,
      oauth: false,
      role: 'Users',
      updatedAt: expect.any(String),
      createdAt: expect.any(String),
    });
  });

  test('success post /register role being admin because in oauth it is already registerd as admin', async () => {
    const response = await request(app).post('/register').send({
      email: 'user2@example.com',
      password: 'password123',
    });

    const { body, status } = response;
    expect(status).toBe(201);
    expect(body).toBeInstanceOf(Object);
    expect(body).toMatchObject({
      email: 'user2@example.com',
      id: 6,
      oauth: false,
      role: 'Admin',
      updatedAt: expect.any(String),
      createdAt: expect.any(String),
    });
  });

  test('failed post /register not email', async () => {
    const response = await request(app).post('/register').send({
      email: 'asdasdads',
      password: 'password123',
    });

    const { body, status } = response;
    expect(status).toBe(400);
    expect(body).toBeInstanceOf(Object);
    expect(body).toHaveProperty('message', 'email format is wrong');
  });

  test('failed post /register no email', async () => {
    const response = await request(app).post('/register').send({
      email: '',
      password: 'password123',
    });

    const { body, status } = response;
    expect(status).toBe(400);
    expect(body).toBeInstanceOf(Object);
    expect(body).toHaveProperty('message', 'email cannot be empty');
  });

  test('failed post /register no password', async () => {
    const response = await request(app).post('/register').send({
      email: 'user12@example.com',
      password: '',
    });

    const { body, status } = response;
    expect(status).toBe(400);
    expect(body).toBeInstanceOf(Object);
    expect(body).toHaveProperty('message', 'password cannot be empty');
  });

  test('failed post /register email already exist', async () => {
    const response = await request(app).post('/register').send({
      email: 'user1@example.com',
      password: 'password123',
    });

    const { body, status } = response;
    expect(status).toBe(400);
    expect(body).toBeInstanceOf(Object);
    expect(body).toHaveProperty(
      'message',
      'Email already exist in the database'
    );
  });
});
describe('POST /login/oauth', () => {
  test('success post /login/oauth', async () => {
    const response = await request(app)
      .post('/login/oauth')
      .set('google_token', process.env.TOKEN_OAUTH);

    const { body, status } = response;
    expect(status).toBe(200);
    expect(body).toBeInstanceOf(Object);
    expect(body).toMatchObject({
      token: expect.any(String),
      role: 'Users',
    });
  });

  test('success post /login/oauth admin because in the server the user is already admin', async () => {
    const response = await request(app)
      .post('/login/oauth')
      .set('google_token', process.env.TOKEN_OUTH_ADMIN);

    const { body, status } = response;
    expect(status).toBe(200);
    expect(body).toBeInstanceOf(Object);
    expect(body).toMatchObject({
      token: expect.any(String),
      role: 'Admin',
    });
  });

  test('failed post /login/oauth no token', async () => {
    const response = await request(app)
      .post('/login/oauth')
      .set('google_token', '');

    const { body, status } = response;
    expect(status).toBe(401);
    expect(body).toBeInstanceOf(Object);
    expect(body).toMatchObject({
      message: 'Error authentication',
    });
  });
});

//end userController

// testing part WeatherController
describe('GET /weathers', () => {
  test('success GET /weathers', async () => {
    const response = await request(app)
      .get('/weathers')
      .query({
        location: 'jakarta',
      })
      .set('Authorization', 'Bearer ' + tokenUser1);

    const { body, status } = response;
    expect(status).toBe(200);
    expect(body).toBeInstanceOf(Object);
    expect(body).toHaveProperty('city', 'Jakarta');
    expect(body).toHaveProperty('weather');
  });

  test('failed GET /weathers no token', async () => {
    const response = await request(app).get('/weathers').query({
      location: 'jakarta',
    });

    const { body, status } = response;
    expect(status).toBe(401);
    expect(body).toBeInstanceOf(Object);
    expect(body).toHaveProperty('message', 'Error authentication');
  });

  test('failed GET /weathers invalid type token', async () => {
    const response = await request(app)
      .get('/weathers')
      .query({
        location: 'jakarta',
      })
      .set('Authorization', 'Bearer ' + 'asdasddwqweqwads');

    const { body, status } = response;
    expect(status).toBe(401);
    expect(body).toBeInstanceOf(Object);
    expect(body).toHaveProperty('message', 'Error authentication');
  });

  test('failed GET /weathers no bearer', async () => {
    const response = await request(app)
      .get('/weathers')
      .query({
        location: 'jakarta',
      })
      .set('Authorization', '' + tokenUser1);

    const { body, status } = response;
    expect(status).toBe(401);
    expect(body).toBeInstanceOf(Object);
    expect(body).toHaveProperty('message', 'Error authentication');
  });

  test('failed GET /weathers no location stated', async () => {
    const response = await request(app)
      .get('/weathers')
      .query({
        location: '',
      })
      .set('Authorization', 'Bearer ' + tokenUser1);
    const { body, status } = response;
    expect(status).toBe(400);
    expect(body).toBeInstanceOf(Object);
    expect(body).toHaveProperty('message', expect.any(String));
  });
});

// end part weather controller

//testing part PaymentController
describe('POST /donation', () => {
  test('success post /donation', async () => {
    const response = await request(app)
      .post('/donation')
      .send({
        name: 'Tester',
        donation: '10000',
      })
      .set('Authorization', 'Bearer ' + tokenUser1);

    const { body, status } = response;
    expect(status).toBe(200);
    expect(body).toBeInstanceOf(Object);
    expect(body).toHaveProperty('link', expect.any(String));
    expect(body).toHaveProperty('token', expect.any(String));
  });

  test('fail post /donation no dontaion inputted', async () => {
    const response = await request(app)
      .post('/donation')
      .send({
        name: 'Tester',
        donation: '',
      })
      .set('Authorization', 'Bearer ' + tokenUser1);

    const { body, status } = response;
    expect(status).toBe(400);
    expect(body).toBeInstanceOf(Object);
    expect(body).toHaveProperty(
      'message',
      'Please input any donation amount each value will be really appreaciated by us'
    );
  });

  test('fail post /donation no token inputted', async () => {
    const response = await request(app).post('/donation').send({
      name: 'Tester',
      donation: '10000',
    });

    const { body, status } = response;
    expect(status).toBe(401);
    expect(body).toBeInstanceOf(Object);
    expect(body).toHaveProperty('message', 'Error authentication');
  });

  test('fail post /donation token is invalid', async () => {
    const response = await request(app)
      .post('/donation')
      .send({
        name: 'Tester',
        donation: '10000',
      })
      .set('Authorization', '' + tokenUser1);

    const { body, status } = response;
    expect(status).toBe(401);
    expect(body).toBeInstanceOf(Object);
    expect(body).toHaveProperty('message', 'Error authentication');
  });

  test('fail post /donation token is random string', async () => {
    const response = await request(app)
      .post('/donation')
      .send({
        name: 'Tester',
        donation: '10000',
      })
      .set('Authorization', 'Bearer ' + 'asdasdasd');

    const { body, status } = response;
    expect(status).toBe(401);
    expect(body).toBeInstanceOf(Object);
    expect(body).toHaveProperty('message', 'Error authentication');
  });
});
// end part PaymentController

// start test part TypeController
describe('GET /types', () => {
  test('success get /types', async () => {
    const response = await request(app)
      .get('/types')
      .set('Authorization', 'Bearer ' + tokenUser1);

    const { body, status } = response;
    expect(status).toBe(200);
    expect(body).toBeInstanceOf(Object);
    expect(body).toMatchObject([
      {
        id: 1,
        name: 'Daily Forecast',
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      },
      {
        id: 2,
        name: 'Weekly Forecast',
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      },
      {
        id: 3,
        name: 'Emergency Forecast',
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      },
      {
        id: 4,
        name: 'Disaster Forecast',
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      },
      {
        id: 5,
        name: 'Special Event Forecast',
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      },
    ]);
  });

  test('failed get /types no token', async () => {
    const response = await request(app).get('/types');

    const { body, status } = response;
    expect(status).toBe(401);
    expect(body).toBeInstanceOf(Object);
    expect(body).toHaveProperty('message', 'Error authentication');
  });

  test('failed get /types token is random string', async () => {
    const response = await request(app)
      .get('/types')
      .set('Authorization', 'Bearer ' + 'asdasdasd');

    const { body, status } = response;
    expect(status).toBe(401);
    expect(body).toBeInstanceOf(Object);
    expect(body).toHaveProperty('message', 'Error authentication');
  });

  test('failed get /types token does not have bearer', async () => {
    const response = await request(app)
      .get('/types')
      .set('Authorization', tokenUser1);

    const { body, status } = response;
    expect(status).toBe(401);
    expect(body).toBeInstanceOf(Object);
    expect(body).toHaveProperty('message', 'Error authentication');
  });
});

describe('POST /types', () => {
  test('success post /types', async () => {
    const response = await request(app)
      .post('/types')
      .send({
        name: 'Testing broadcast type',
      })
      .set('Authorization', 'Bearer ' + tokenUser2);

    const { body, status } = response;
    expect(status).toBe(201);
    expect(body).toBeInstanceOf(Object);
    expect(body).toMatchObject({
      id: 6,
      name: 'Testing broadcast type',
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
  });

  test('failed post /types no token', async () => {
    const response = await request(app).post('/types').send({
      name: 'Another Testing broadcast type',
    });

    const { body, status } = response;
    expect(status).toBe(401);
    expect(body).toBeInstanceOf(Object);
    expect(body).toHaveProperty('message', 'Error authentication');
  });

  test('failed post /types token is random string', async () => {
    const response = await request(app)
      .get('/types')
      .send({
        name: 'Another Testing broadcast type',
      })
      .set('Authorization', 'Bearer ' + 'asdasdasd');

    const { body, status } = response;
    expect(status).toBe(401);
    expect(body).toBeInstanceOf(Object);
    expect(body).toHaveProperty('message', 'Error authentication');
  });

  test('failed post /types token does not have bearer', async () => {
    const response = await request(app)
      .get('/types')
      .send({
        name: 'Another Testing broadcast type',
      })
      .set('Authorization', tokenUser1);

    const { body, status } = response;
    expect(status).toBe(401);
    expect(body).toBeInstanceOf(Object);
    expect(body).toHaveProperty('message', 'Error authentication');
  });

  test('failed post /types user is not admin', async () => {
    const response = await request(app)
      .post('/types')
      .send({
        name: 'Another Testing broadcast type',
      })
      .set('Authorization', 'Bearer ' + tokenUser1);

    const { body, status } = response;
    expect(status).toBe(403);
    expect(body).toBeInstanceOf(Object);
    expect(body).toHaveProperty('message', 'Forbidden');
  });

  test('failed post /types the type name is empty', async () => {
    const response = await request(app)
      .post('/types')
      .send({
        name: '',
      })
      .set('Authorization', 'Bearer ' + tokenUser2);

    const { body, status } = response;
    expect(status).toBe(400);
    expect(body).toBeInstanceOf(Object);
    expect(body).toHaveProperty('message', 'Name cannot be empty');
  });
});

describe('PUT /types/:id', () => {
  test('success put /types/:id', async () => {
    const response = await request(app)
      .put('/types/6')
      .send({
        name: 'Testing broadcast type update',
      })
      .set('Authorization', 'Bearer ' + tokenUser2);

    const { body, status } = response;
    expect(status).toBe(200);
    expect(body).toBeInstanceOf(Object);
    expect(body).toMatchObject({
      id: 6,
      name: 'Testing broadcast type update',
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
  });

  test('failed put /types/:id no token', async () => {
    const response = await request(app).put('/types/6').send({
      name: 'Another Testing broadcast type update',
    });

    const { body, status } = response;
    expect(status).toBe(401);
    expect(body).toBeInstanceOf(Object);
    expect(body).toHaveProperty('message', 'Error authentication');
  });

  test('failed put /types/:id token is random string', async () => {
    const response = await request(app)
      .put('/types/6')
      .send({
        name: 'Another Testing broadcast type update',
      })
      .set('Authorization', 'Bearer ' + 'asdasdasd');

    const { body, status } = response;
    expect(status).toBe(401);
    expect(body).toBeInstanceOf(Object);
    expect(body).toHaveProperty('message', 'Error authentication');
  });

  test('failed put /types/:id token does not have bearer', async () => {
    const response = await request(app)
      .put('/types/6')
      .send({
        name: 'Another Testing broadcast type update',
      })
      .set('Authorization', tokenUser1);

    const { body, status } = response;
    expect(status).toBe(401);
    expect(body).toBeInstanceOf(Object);
    expect(body).toHaveProperty('message', 'Error authentication');
  });

  test('failed put /types/:id user is not admin', async () => {
    const response = await request(app)
      .put('/types/6')
      .send({
        name: 'Another Testing broadcast type update',
      })
      .set('Authorization', 'Bearer ' + tokenUser1);

    const { body, status } = response;
    expect(status).toBe(403);
    expect(body).toBeInstanceOf(Object);
    expect(body).toHaveProperty('message', 'Forbidden');
  });

  test('failed put /types/:id the type does not exist', async () => {
    const response = await request(app)
      .put('/types/100')
      .send({
        name: 'Another Testing broadcast type update',
      })
      .set('Authorization', 'Bearer ' + tokenUser2);

    const { body, status } = response;
    expect(status).toBe(404);
    expect(body).toBeInstanceOf(Object);
    expect(body).toHaveProperty('message', 'Data not found');
  });

  test('failed put /types/:id the type name is empty', async () => {
    const response = await request(app)
      .put('/types/6')
      .send({
        name: '',
      })
      .set('Authorization', 'Bearer ' + tokenUser2);

    const { body, status } = response;
    expect(status).toBe(400);
    expect(body).toBeInstanceOf(Object);
    expect(body).toHaveProperty('message', 'Name cannot be empty');
  });
});

describe('DELETE /types/:id', () => {
  test('success delete /types/:id', async () => {
    const response = await request(app)
      .delete('/types/6')
      .set('Authorization', 'Bearer ' + tokenUser2);

    const { body, status } = response;
    expect(status).toBe(200);
    expect(body).toBeInstanceOf(Object);
    expect(body).toMatchObject({
      message:
        'Type Testing broadcast type update has been successfully deleted',
    });
  });

  test('failed delete /types/:id no token', async () => {
    const response = await request(app).delete('/types/6');

    const { body, status } = response;
    expect(status).toBe(401);
    expect(body).toBeInstanceOf(Object);
    expect(body).toHaveProperty('message', 'Error authentication');
  });

  test('failed delete /types/:id token is random string', async () => {
    const response = await request(app)
      .delete('/types/6')
      .set('Authorization', 'Bearer ' + 'asdasdasd');

    const { body, status } = response;
    expect(status).toBe(401);
    expect(body).toBeInstanceOf(Object);
    expect(body).toHaveProperty('message', 'Error authentication');
  });

  test('failed delete /types/:id token does not have bearer', async () => {
    const response = await request(app)
      .delete('/types/6')
      .set('Authorization', tokenUser1);

    const { body, status } = response;
    expect(status).toBe(401);
    expect(body).toBeInstanceOf(Object);
    expect(body).toHaveProperty('message', 'Error authentication');
  });

  test('failed delete /types/:id user is not admin', async () => {
    const response = await request(app)
      .delete('/types/6')
      .set('Authorization', 'Bearer ' + tokenUser1);

    const { body, status } = response;
    expect(status).toBe(403);
    expect(body).toBeInstanceOf(Object);
    expect(body).toHaveProperty('message', 'Forbidden');
  });

  test('failed delete /types/:id the type does not exist', async () => {
    const response = await request(app)
      .delete('/types/100')
      .set('Authorization', 'Bearer ' + tokenUser2);

    const { body, status } = response;
    expect(status).toBe(404);
    expect(body).toBeInstanceOf(Object);
    expect(body).toHaveProperty('message', 'Data not found');
  });
});
// end test part TypeController

// start test part PostController
describe('GET /posts', () => {
  test('success get /posts', async () => {
    const response = await request(app)
      .get('/posts')
      .set('Authorization', 'Bearer ' + tokenUser1);

    const { body, status } = response;
    expect(status).toBe(200);
    expect(body).toBeInstanceOf(Object);
    expect(body[0]).toMatchObject({
      id: 1,
      title: 'Weather Update: Heavy Rain Expected',
      shortDescription: 'Heavy rain forecasted for the next 24 hours.',
      longDescription:
        'A weather system is expected to bring heavy rainfall to the region...',
      imgUrl:
        'https://t4.ftcdn.net/jpg/02/66/38/15/240_F_266381525_alVrbw15u5EjhIpoqqa1eI5ghSf7hpz7.jpg',
      typeId: 3,
      userId: 2,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
  });

  test('success get /posts with search feature', async () => {
    const response = await request(app)
      .get('/posts?search=alert')
      .set('Authorization', 'Bearer ' + tokenUser1);

    const { body, status } = response;
    expect(status).toBe(200);
    expect(body).toBeInstanceOf(Object);
    expect(body).toMatchObject({
      page: 1,
      data: [
        {
          id: 2,
          title: 'Upcoming Heatwave Alert',
          shortDescription: 'High temperatures forecasted for the next week.',
          longDescription:
            'A prolonged period of hot and dry weather is expected to...',
          imgUrl:
            'https://t4.ftcdn.net/jpg/02/66/38/15/240_F_266381525_alVrbw15u5EjhIpoqqa1eI5ghSf7hpz7.jpg',
          typeId: 3,
          userId: 3,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
        {
          id: 5,
          title: 'Hurricane Alert: Category 3 Hurricane Approaching',
          shortDescription: 'Category 3 hurricane expected to make landfall...',
          longDescription:
            'A powerful Category 3 hurricane is forecasted to strike...',
          imgUrl:
            'https://t4.ftcdn.net/jpg/02/66/38/15/240_F_266381525_alVrbw15u5EjhIpoqqa1eI5ghSf7hpz7.jpg',
          typeId: 4,
          userId: 3,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
      ],
      totalData: 2,
      totalPage: 1,
      dataPerPage: 2,
    });
  });

  test('success get /posts with search feature with filter', async () => {
    const response = await request(app)
      .get('/posts?search=alert&filter=3')
      .set('Authorization', 'Bearer ' + tokenUser1);

    const { body, status } = response;
    expect(status).toBe(200);
    expect(body).toBeInstanceOf(Object);
    expect(body).toMatchObject({
      page: 1,
      data: [
        {
          id: 2,
          title: 'Upcoming Heatwave Alert',
          shortDescription: 'High temperatures forecasted for the next week.',
          longDescription:
            'A prolonged period of hot and dry weather is expected to...',
          imgUrl:
            'https://t4.ftcdn.net/jpg/02/66/38/15/240_F_266381525_alVrbw15u5EjhIpoqqa1eI5ghSf7hpz7.jpg',
          typeId: 3,
          userId: 3,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
      ],
      totalData: 1,
      totalPage: 1,
      dataPerPage: 1,
    });
  });

  test('success get /posts with search and oldest to earliest data', async () => {
    const response = await request(app)
      .get('/posts?search=alert&sort=+')
      .set('Authorization', 'Bearer ' + tokenUser1);

    const { body, status } = response;
    expect(status).toBe(200);
    expect(body).toBeInstanceOf(Object);
    expect(body).toMatchObject({
      page: 1,
      data: [
        {
          id: 2,
          title: 'Upcoming Heatwave Alert',
          shortDescription: 'High temperatures forecasted for the next week.',
          longDescription:
            'A prolonged period of hot and dry weather is expected to...',
          imgUrl:
            'https://t4.ftcdn.net/jpg/02/66/38/15/240_F_266381525_alVrbw15u5EjhIpoqqa1eI5ghSf7hpz7.jpg',
          typeId: 3,
          userId: 3,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
        {
          id: 5,
          title: 'Hurricane Alert: Category 3 Hurricane Approaching',
          shortDescription: 'Category 3 hurricane expected to make landfall...',
          longDescription:
            'A powerful Category 3 hurricane is forecasted to strike...',
          imgUrl:
            'https://t4.ftcdn.net/jpg/02/66/38/15/240_F_266381525_alVrbw15u5EjhIpoqqa1eI5ghSf7hpz7.jpg',
          typeId: 4,
          userId: 3,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
      ],
      totalData: 2,
      totalPage: 1,
      dataPerPage: 2,
    });
  });

  test('success get /posts with search and earliest to oldest data', async () => {
    await Post.create({
      title: 'Alert: Example Title New Post',
      shortDescription: 'Short description of the post',
      longDescription:
        'Longer description of the post where all of this data is about weathering you about into the future problems',
      imgUrl:
        'https://t4.ftcdn.net/jpg/02/66/38/15/240_F_266381525_alVrbw15u5EjhIpoqqa1eI5ghSf7hpz7.jpg',
      typeId: 1,
      userId: 2,
    });

    const response = await request(app)
      .get('/posts?search=alert&sort=-')
      .set('Authorization', 'Bearer ' + tokenUser1);

    const { body, status } = response;

    expect(status).toBe(200);
    expect(body).toBeInstanceOf(Object);
    expect(body.data[0]).toMatchObject({
      id: 6,
      title: 'Alert: Example Title New Post',
      shortDescription: 'Short description of the post',
      longDescription:
        'Longer description of the post where all of this data is about weathering you about into the future problems',
      imgUrl:
        'https://t4.ftcdn.net/jpg/02/66/38/15/240_F_266381525_alVrbw15u5EjhIpoqqa1eI5ghSf7hpz7.jpg',
      typeId: 1,
      userId: 2,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
  });

  test('success get /posts with pagination', async () => {
    const response = await request(app)
      .get('/posts?page[number]=1')
      .set('Authorization', 'Bearer ' + tokenUser1);

    const { body, status } = response;
    expect(status).toBe(200);
    expect(body).toBeInstanceOf(Object);
    expect(response.body).toEqual({
      page: '1',
      data: expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(Number),
          title: expect.any(String),
          shortDescription: expect.any(String),
          longDescription: expect.any(String),
          imgUrl: expect.any(String),
          typeId: expect.any(Number),
          userId: expect.any(Number),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        }),
      ]),
      totalData: 6,
      totalPage: 1,
      dataPerPage: 10,
    });
  });

  test('failed get /posts token is not a valid token', async () => {
    const response = await request(app)
      .get('/posts')
      .set(
        'Authorization',
        'Bearer ' +
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjMiLCJpYXQiOjE1MTYyMzkwMjJ9.bVQ5ayJJT_lXVLctXRLgSSitej844tig25rXlq0jXag'
      );

    const { body, status } = response;
    expect(status).toBe(401);
    expect(body).toBeInstanceOf(Object);
    expect(body).toHaveProperty('message', 'Error authentication');
  });

  test('failed get /posts no token', async () => {
    const response = await request(app).get('/posts');

    const { body, status } = response;
    expect(status).toBe(401);
    expect(body).toBeInstanceOf(Object);
    expect(body).toHaveProperty('message', 'Error authentication');
  });

  test('failed get /posts token is random string', async () => {
    const response = await request(app)
      .get('/posts')
      .set('Authorization', 'Bearer ' + 'asdasdasd');

    const { body, status } = response;
    expect(status).toBe(401);
    expect(body).toBeInstanceOf(Object);
    expect(body).toHaveProperty('message', 'Error authentication');
  });

  test('failed get /posts token does not have bearer', async () => {
    const response = await request(app)
      .get('/posts')
      .set('Authorization', tokenUser1);

    const { body, status } = response;
    expect(status).toBe(401);
    expect(body).toBeInstanceOf(Object);
    expect(body).toHaveProperty('message', 'Error authentication');
  });
});

describe('GET /posts/:id', () => {
  test('success get /posts/:id', async () => {
    const response = await request(app)
      .get('/posts/3')
      .set('Authorization', 'Bearer ' + tokenUser2);

    const { body, status } = response;
    expect(status).toBe(200);
    expect(body).toBeInstanceOf(Object);
    expect(body).toMatchObject({
      id: 3,
      title: 'Tornado Watch Issued',
      shortDescription: 'Tornado watch in effect until 8 PM.',
      longDescription:
        'The National Weather Service has issued a tornado watch for...',
      imgUrl:
        'https://t4.ftcdn.net/jpg/02/66/38/15/240_F_266381525_alVrbw15u5EjhIpoqqa1eI5ghSf7hpz7.jpg',
      typeId: 4,
      userId: 3,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      User: {
        email: 'nathaniel.untoro@gmail.com',
      },
      Type: {
        name: 'Disaster Forecast',
      },
    });
  });

  test('failed get /posts/:id token is not a valid token', async () => {
    const response = await request(app)
      .get('/posts/1')
      .set(
        'Authorization',
        'Bearer ' +
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjMiLCJpYXQiOjE1MTYyMzkwMjJ9.bVQ5ayJJT_lXVLctXRLgSSitej844tig25rXlq0jXag'
      );

    const { body, status } = response;
    expect(status).toBe(401);
    expect(body).toBeInstanceOf(Object);
    expect(body).toHaveProperty('message', 'Error authentication');
  });

  test('failed get /posts/:id no token', async () => {
    const response = await request(app).get('/posts/1');

    const { body, status } = response;
    expect(status).toBe(401);
    expect(body).toBeInstanceOf(Object);
    expect(body).toHaveProperty('message', 'Error authentication');
  });

  test('failed get /posts/:id token is random string', async () => {
    const response = await request(app)
      .get('/posts/1')
      .set('Authorization', 'Bearer ' + 'asdasdasd');

    const { body, status } = response;
    expect(status).toBe(401);
    expect(body).toBeInstanceOf(Object);
    expect(body).toHaveProperty('message', 'Error authentication');
  });

  test('failed get /posts/:id token does not have bearer', async () => {
    const response = await request(app)
      .get('/posts/1')
      .set('Authorization', tokenUser1);

    const { body, status } = response;
    expect(status).toBe(401);
    expect(body).toBeInstanceOf(Object);
    expect(body).toHaveProperty('message', 'Error authentication');
  });

  test('failed get /posts/:id post id does not exist', async () => {
    const response = await request(app)
      .get('/posts/100')
      .set('Authorization', 'Bearer ' + tokenUser2);

    const { body, status } = response;
    expect(status).toBe(404);
    expect(body).toBeInstanceOf(Object);
    expect(body).toHaveProperty('message', 'Data not found');
  });
});

describe('PUT /posts/:id', () => {
  test('success put /posts/:id', async () => {
    const response = await request(app)
      .put('/posts/1')
      .send({
        title: 'Example Title update',
        shortDescription: 'Short description of the post',
        longDescription:
          'Longer description of the post where all of this data is about weathering you about into the future problems',
        imgUrl:
          'https://t4.ftcdn.net/jpg/02/66/38/15/240_F_266381525_alVrbw15u5EjhIpoqqa1eI5ghSf7hpz7.jpg',
        typeId: 1,
      })
      .set('Authorization', 'Bearer ' + tokenUser2);

    const { body, status } = response;
    expect(status).toBe(200);
    expect(body).toBeInstanceOf(Object);
    expect(body).toMatchObject({
      id: 1,
      title: 'Example Title update',
      shortDescription: 'Short description of the post',
      longDescription:
        'Longer description of the post where all of this data is about weathering you about into the future problems',
      imgUrl:
        'https://t4.ftcdn.net/jpg/02/66/38/15/240_F_266381525_alVrbw15u5EjhIpoqqa1eI5ghSf7hpz7.jpg',
      typeId: 1,
      userId: 2,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
  });

  // ini bisa copy untuk post untuk ke bawah
  test('failed put /posts/:id no title', async () => {
    const response = await request(app)
      .put('/posts/1')
      .send({
        title: '',
        shortDescription: 'Short description of the post',
        longDescription:
          'Longer description of the post where all of this data is about weathering you about into the future problems',
        imgUrl:
          'https://t4.ftcdn.net/jpg/02/66/38/15/240_F_266381525_alVrbw15u5EjhIpoqqa1eI5ghSf7hpz7.jpg',
        typeId: 1,
      })
      .set('Authorization', 'Bearer ' + tokenUser2);

    const { body, status } = response;
    expect(status).toBe(400);
    expect(body).toBeInstanceOf(Object);
    expect(body).toHaveProperty('message', 'Title is required');
  });

  test('failed put /posts/:id no short description', async () => {
    const response = await request(app)
      .put('/posts/1')
      .send({
        title: 'Example Title update',
        shortDescription: '',
        longDescription:
          'Longer description of the post where all of this data is about weathering you about into the future problems',
        imgUrl:
          'https://t4.ftcdn.net/jpg/02/66/38/15/240_F_266381525_alVrbw15u5EjhIpoqqa1eI5ghSf7hpz7.jpg',
        typeId: 1,
      })
      .set('Authorization', 'Bearer ' + tokenUser2);

    const { body, status } = response;
    expect(status).toBe(400);
    expect(body).toBeInstanceOf(Object);
    expect(body).toHaveProperty('message', 'Short description is required');
  });

  test('failed put /posts/:id short description is too long', async () => {
    const response = await request(app)
      .put('/posts/1')
      .send({
        title: 'Example Title update',
        shortDescription:
          'Ada Ada Ada Ada Ada Ada Ada Ada Ada Ada Ada Ada Ada Ada Ada Ada Ada Ada Ada Ada Ada Ada Ada Ada Ada Ada Ada Ada Ada Ada Ada ',
        longDescription:
          'Longer description of the post where all of this data is about weathering you about into the future problems',
        imgUrl:
          'https://t4.ftcdn.net/jpg/02/66/38/15/240_F_266381525_alVrbw15u5EjhIpoqqa1eI5ghSf7hpz7.jpg',
        typeId: 1,
      })
      .set('Authorization', 'Bearer ' + tokenUser2);

    const { body, status } = response;
    expect(status).toBe(400);
    expect(body).toBeInstanceOf(Object);
    expect(body).toHaveProperty(
      'message',
      'maximal character is 30 words for short description'
    );
  });

  test('failed put /posts/:id no long description', async () => {
    const response = await request(app)
      .put('/posts/1')
      .send({
        title: 'Example Title update',
        shortDescription: 'Short description of the post',
        longDescription: null,
        imgUrl:
          'https://t4.ftcdn.net/jpg/02/66/38/15/240_F_266381525_alVrbw15u5EjhIpoqqa1eI5ghSf7hpz7.jpg',
        typeId: 1,
      })
      .set('Authorization', 'Bearer ' + tokenUser2);

    const { body, status } = response;
    expect(status).toBe(400);
    expect(body).toBeInstanceOf(Object);
    expect(body).toHaveProperty('message', 'Long description is required');
  });

  test('failed put /posts/:id long description is too small', async () => {
    const response = await request(app)
      .put('/posts/1')
      .send({
        title: 'Example Title update',
        shortDescription: 'Short description of the post',
        longDescription: 'long description',
        imgUrl:
          'https://t4.ftcdn.net/jpg/02/66/38/15/240_F_266381525_alVrbw15u5EjhIpoqqa1eI5ghSf7hpz7.jpg',
        typeId: 1,
      })
      .set('Authorization', 'Bearer ' + tokenUser2);

    const { body, status } = response;
    expect(status).toBe(400);
    expect(body).toBeInstanceOf(Object);
    expect(body).toHaveProperty(
      'message',
      'minimal character in long description is 10 words'
    );
  });

  test('failed put /posts/:id no image url', async () => {
    const response = await request(app)
      .put('/posts/1')
      .send({
        title: 'Example Title update',
        shortDescription: 'Short description of the post',
        longDescription:
          'Longer description of the post where all of this data is about weathering you about into the future problems',
        imgUrl: '',
        typeId: 1,
      })
      .set('Authorization', 'Bearer ' + tokenUser2);

    const { body, status } = response;
    expect(status).toBe(400);
    expect(body).toBeInstanceOf(Object);
    expect(body).toHaveProperty('message', 'Image URL is required');
  });

  test('failed put /posts/:id no token', async () => {
    const response = await request(app).put('/posts/1').send({
      title: 'Example Title update',
      shortDescription: 'Short description of the post',
      longDescription:
        'Longer description of the post where all of this data is about weathering you about into the future problems',
      imgUrl:
        'https://t4.ftcdn.net/jpg/02/66/38/15/240_F_266381525_alVrbw15u5EjhIpoqqa1eI5ghSf7hpz7.jpg',
      typeId: 1,
    });

    const { body, status } = response;
    expect(status).toBe(401);
    expect(body).toBeInstanceOf(Object);
    expect(body).toHaveProperty('message', 'Error authentication');
  });

  test('failed put /posts/:id token is random string', async () => {
    const response = await request(app)
      .put('/posts/1')
      .send({
        title: 'Example Title update',
        shortDescription: 'Short description of the post',
        longDescription:
          'Longer description of the post where all of this data is about weathering you about into the future problems',
        imgUrl:
          'https://t4.ftcdn.net/jpg/02/66/38/15/240_F_266381525_alVrbw15u5EjhIpoqqa1eI5ghSf7hpz7.jpg',
        typeId: 1,
      })
      .set('Authorization', 'Bearer ' + 'asdasdasd');

    const { body, status } = response;
    expect(status).toBe(401);
    expect(body).toBeInstanceOf(Object);
    expect(body).toHaveProperty('message', 'Error authentication');
  });

  test('failed put /posts/:id token does not have bearer', async () => {
    const response = await request(app)
      .put('/posts/1')
      .send({
        title: 'Example Title update',
        shortDescription: 'Short description of the post',
        longDescription:
          'Longer description of the post where all of this data is about weathering you about into the future problems',
        imgUrl:
          'https://t4.ftcdn.net/jpg/02/66/38/15/240_F_266381525_alVrbw15u5EjhIpoqqa1eI5ghSf7hpz7.jpg',
        typeId: 1,
      })
      .set('Authorization', tokenUser1);

    const { body, status } = response;
    expect(status).toBe(401);
    expect(body).toBeInstanceOf(Object);
    expect(body).toHaveProperty('message', 'Error authentication');
  });

  test('failed put /posts/:id user is not admin', async () => {
    const response = await request(app)
      .put('/posts/100')
      .send({
        title: 'Example Title update',
        shortDescription: 'Short description of the post',
        longDescription:
          'Longer description of the post where all of this data is about weathering you about into the future problems',
        imgUrl:
          'https://t4.ftcdn.net/jpg/02/66/38/15/240_F_266381525_alVrbw15u5EjhIpoqqa1eI5ghSf7hpz7.jpg',
        typeId: 1,
      })
      .set('Authorization', 'Bearer ' + tokenUser1);

    const { body, status } = response;
    expect(status).toBe(403);
    expect(body).toBeInstanceOf(Object);
    expect(body).toHaveProperty('message', 'Forbidden');
  });

  test('failed put /posts/:id post id does not exist', async () => {
    const response = await request(app)
      .put('/posts/100')
      .send({
        title: 'Example Title update',
        shortDescription: 'Short description of the post',
        longDescription:
          'Longer description of the post where all of this data is about weathering you about into the future problems',
        imgUrl:
          'https://t4.ftcdn.net/jpg/02/66/38/15/240_F_266381525_alVrbw15u5EjhIpoqqa1eI5ghSf7hpz7.jpg',
        typeId: 1,
      })
      .set('Authorization', 'Bearer ' + tokenUser2);

    const { body, status } = response;
    expect(status).toBe(404);
    expect(body).toBeInstanceOf(Object);
    expect(body).toHaveProperty('message', 'Data not found');
  });
});

describe('DELETE /post/:id', () => {
  test('success delete /posts/:id', async () => {
    const response = await request(app)
      .delete('/posts/1')
      .set('Authorization', 'Bearer ' + tokenUser2);

    const { body, status } = response;
    expect(status).toBe(200);
    expect(body).toBeInstanceOf(Object);
    expect(body).toMatchObject({
      message: `Example Title update has been successfully being deleted`,
    });
  });
  test('failed delete /posts/:id no token', async () => {
    const response = await request(app).delete('/posts/1');

    const { body, status } = response;
    expect(status).toBe(401);
    expect(body).toBeInstanceOf(Object);
    expect(body).toHaveProperty('message', 'Error authentication');
  });

  test('failed delete /posts/:id token is random string', async () => {
    const response = await request(app)
      .delete('/posts/1')
      .set('Authorization', 'Bearer ' + 'asdasdasd');

    const { body, status } = response;
    expect(status).toBe(401);
    expect(body).toBeInstanceOf(Object);
    expect(body).toHaveProperty('message', 'Error authentication');
  });

  test('failed delete /posts/:id token is not a valid token', async () => {
    const response = await request(app)
      .delete('/posts/1')
      .set(
        'Authorization',
        'Bearer ' +
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjMiLCJpYXQiOjE1MTYyMzkwMjJ9.bVQ5ayJJT_lXVLctXRLgSSitej844tig25rXlq0jXag'
      );

    const { body, status } = response;
    expect(status).toBe(401);
    expect(body).toBeInstanceOf(Object);
    expect(body).toHaveProperty('message', 'Error authentication');
  });

  test('failed delete /posts/:id token does not have bearer', async () => {
    const response = await request(app)
      .delete('/posts/1')
      .set('Authorization', tokenUser1);

    const { body, status } = response;
    expect(status).toBe(401);
    expect(body).toBeInstanceOf(Object);
    expect(body).toHaveProperty('message', 'Error authentication');
  });

  test('failed delete /posts/:id user is not admin', async () => {
    const response = await request(app)
      .delete('/posts/1')
      .set('Authorization', 'Bearer ' + tokenUser1);

    const { body, status } = response;
    expect(status).toBe(403);
    expect(body).toBeInstanceOf(Object);
    expect(body).toHaveProperty('message', 'Forbidden');
  });

  test('failed delete /posts/:id post id does not exist', async () => {
    const response = await request(app)
      .delete('/posts/100')
      .set('Authorization', 'Bearer ' + tokenUser2);

    const { body, status } = response;
    expect(status).toBe(404);
    expect(body).toBeInstanceOf(Object);
    expect(body).toHaveProperty('message', 'Data not found');
  });

  test('failed delete /posts/:id user is not the owner of the post', async () => {
    const response = await request(app)
      .delete('/posts/2')
      .set('Authorization', 'Bearer ' + tokenUser2);

    const { body, status } = response;
    expect(status).toBe(403);
    expect(body).toBeInstanceOf(Object);
    expect(body).toHaveProperty('message', 'Forbidden');
  });
});

describe('POST /posts', () => {
  test('success post /posts', async () => {
    const response = await request(app)
      .post('/posts')
      .send({
        title: 'Example Title New Post',
        shortDescription: 'Short description of the post',
        longDescription:
          'Longer description of the post where all of this data is about weathering you about into the future problems',
        imgUrl:
          'https://t4.ftcdn.net/jpg/02/66/38/15/240_F_266381525_alVrbw15u5EjhIpoqqa1eI5ghSf7hpz7.jpg',
        typeId: 1,
      })
      .set('Authorization', 'Bearer ' + tokenUser2);

    const { body, status } = response;
    expect(status).toBe(201);
    expect(body).toBeInstanceOf(Object);
    expect(body).toMatchObject({
      id: 7,
      title: 'Example Title New Post',
      shortDescription: 'Short description of the post',
      longDescription:
        'Longer description of the post where all of this data is about weathering you about into the future problems',
      imgUrl:
        'https://t4.ftcdn.net/jpg/02/66/38/15/240_F_266381525_alVrbw15u5EjhIpoqqa1eI5ghSf7hpz7.jpg',
      typeId: 1,
      userId: 2,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
  });

  // ini bisa copy untuk post untuk ke bawah
  test('failed post /posts no title', async () => {
    const response = await request(app)
      .post('/posts')
      .send({
        title: '',
        shortDescription: 'Short description of the post',
        longDescription:
          'Longer description of the post where all of this data is about weathering you about into the future problems',
        imgUrl:
          'https://t4.ftcdn.net/jpg/02/66/38/15/240_F_266381525_alVrbw15u5EjhIpoqqa1eI5ghSf7hpz7.jpg',
        typeId: 1,
      })
      .set('Authorization', 'Bearer ' + tokenUser2);

    const { body, status } = response;
    expect(status).toBe(400);
    expect(body).toBeInstanceOf(Object);
    expect(body).toHaveProperty('message', 'Title is required');
  });

  test('failed post /posts no short description', async () => {
    const response = await request(app)
      .post('/posts')
      .send({
        title: 'Example Title update',
        shortDescription: '',
        longDescription:
          'Longer description of the post where all of this data is about weathering you about into the future problems',
        imgUrl:
          'https://t4.ftcdn.net/jpg/02/66/38/15/240_F_266381525_alVrbw15u5EjhIpoqqa1eI5ghSf7hpz7.jpg',
        typeId: 1,
      })
      .set('Authorization', 'Bearer ' + tokenUser2);

    const { body, status } = response;
    expect(status).toBe(400);
    expect(body).toBeInstanceOf(Object);
    expect(body).toHaveProperty('message', 'Short description is required');
  });

  test('failed post /posts short description is too long', async () => {
    const response = await request(app)
      .post('/posts')
      .send({
        title: 'Example Title update',
        shortDescription:
          'Ada Ada Ada Ada Ada Ada Ada Ada Ada Ada Ada Ada Ada Ada Ada Ada Ada Ada Ada Ada Ada Ada Ada Ada Ada Ada Ada Ada Ada Ada Ada ',
        longDescription:
          'Longer description of the post where all of this data is about weathering you about into the future problems',
        imgUrl:
          'https://t4.ftcdn.net/jpg/02/66/38/15/240_F_266381525_alVrbw15u5EjhIpoqqa1eI5ghSf7hpz7.jpg',
        typeId: 1,
      })
      .set('Authorization', 'Bearer ' + tokenUser2);

    const { body, status } = response;
    expect(status).toBe(400);
    expect(body).toBeInstanceOf(Object);
    expect(body).toHaveProperty(
      'message',
      'maximal character is 30 words for short description'
    );
  });

  test('failed post /posts no long description', async () => {
    const response = await request(app)
      .post('/posts')
      .send({
        title: 'Example Title update',
        shortDescription: 'Short description of the post',
        longDescription: null,
        imgUrl:
          'https://t4.ftcdn.net/jpg/02/66/38/15/240_F_266381525_alVrbw15u5EjhIpoqqa1eI5ghSf7hpz7.jpg',
        typeId: 1,
      })
      .set('Authorization', 'Bearer ' + tokenUser2);

    const { body, status } = response;
    expect(status).toBe(400);
    expect(body).toBeInstanceOf(Object);
    expect(body).toHaveProperty('message', 'Long description is required');
  });

  test('failed post /posts long description is too small', async () => {
    const response = await request(app)
      .post('/posts')
      .send({
        title: 'Example Title update',
        shortDescription: 'Short description of the post',
        longDescription: 'long description',
        imgUrl:
          'https://t4.ftcdn.net/jpg/02/66/38/15/240_F_266381525_alVrbw15u5EjhIpoqqa1eI5ghSf7hpz7.jpg',
        typeId: 1,
      })
      .set('Authorization', 'Bearer ' + tokenUser2);

    const { body, status } = response;
    expect(status).toBe(400);
    expect(body).toBeInstanceOf(Object);
    expect(body).toHaveProperty(
      'message',
      'minimal character in long description is 10 words'
    );
  });

  test('failed post /posts no image url', async () => {
    const response = await request(app)
      .post('/posts')
      .send({
        title: 'Example Title update',
        shortDescription: 'Short description of the post',
        longDescription:
          'Longer description of the post where all of this data is about weathering you about into the future problems',
        imgUrl: '',
        typeId: 1,
      })
      .set('Authorization', 'Bearer ' + tokenUser2);

    const { body, status } = response;
    expect(status).toBe(400);
    expect(body).toBeInstanceOf(Object);
    expect(body).toHaveProperty('message', 'Image URL is required');
  });

  test('failed post /posts no token', async () => {
    const response = await request(app).post('/posts').send({
      title: 'Example Title update',
      shortDescription: 'Short description of the post',
      longDescription:
        'Longer description of the post where all of this data is about weathering you about into the future problems',
      imgUrl:
        'https://t4.ftcdn.net/jpg/02/66/38/15/240_F_266381525_alVrbw15u5EjhIpoqqa1eI5ghSf7hpz7.jpg',
      typeId: 1,
    });

    const { body, status } = response;
    expect(status).toBe(401);
    expect(body).toBeInstanceOf(Object);
    expect(body).toHaveProperty('message', 'Error authentication');
  });

  test('failed post /posts token is random string', async () => {
    const response = await request(app)
      .post('/posts')
      .send({
        title: 'Example Title update',
        shortDescription: 'Short description of the post',
        longDescription:
          'Longer description of the post where all of this data is about weathering you about into the future problems',
        imgUrl:
          'https://t4.ftcdn.net/jpg/02/66/38/15/240_F_266381525_alVrbw15u5EjhIpoqqa1eI5ghSf7hpz7.jpg',
        typeId: 1,
      })
      .set('Authorization', 'Bearer ' + 'asdasdasd');

    const { body, status } = response;
    expect(status).toBe(401);
    expect(body).toBeInstanceOf(Object);
    expect(body).toHaveProperty('message', 'Error authentication');
  });

  test('failed post /posts token does not have bearer', async () => {
    const response = await request(app)
      .post('/posts')
      .send({
        title: 'Example Title update',
        shortDescription: 'Short description of the post',
        longDescription:
          'Longer description of the post where all of this data is about weathering you about into the future problems',
        imgUrl:
          'https://t4.ftcdn.net/jpg/02/66/38/15/240_F_266381525_alVrbw15u5EjhIpoqqa1eI5ghSf7hpz7.jpg',
        typeId: 1,
      })
      .set('Authorization', tokenUser1);

    const { body, status } = response;
    expect(status).toBe(401);
    expect(body).toBeInstanceOf(Object);
    expect(body).toHaveProperty('message', 'Error authentication');
  });

  test('failed post /posts user is not admin', async () => {
    const response = await request(app)
      .post('/posts')
      .send({
        title: 'Example Title update',
        shortDescription: 'Short description of the post',
        longDescription:
          'Longer description of the post where all of this data is about weathering you about into the future problems',
        imgUrl:
          'https://t4.ftcdn.net/jpg/02/66/38/15/240_F_266381525_alVrbw15u5EjhIpoqqa1eI5ghSf7hpz7.jpg',
        typeId: 1,
      })
      .set('Authorization', 'Bearer ' + tokenUser1);

    const { body, status } = response;
    expect(status).toBe(403);
    expect(body).toBeInstanceOf(Object);
    expect(body).toHaveProperty('message', 'Forbidden');
  });
});

afterAll(async () => {
  await Post.destroy({
    where: {},
    truncate: true,
    cascade: true,
    restartIdentity: true,
  });
  await Type.destroy({
    where: {},
    truncate: true,
    cascade: true,
    restartIdentity: true,
  });
  await User.destroy({
    where: {},
    truncate: true,
    cascade: true,
    restartIdentity: true,
  });
});
