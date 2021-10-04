require('dotenv').config();

const { execSync } = require('child_process');

const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');

describe('app routes', () => {
  describe('routes', () => {
    // let token;
  
    beforeAll(async () => {
      execSync('npm run setup-db');
  
      await client.connect();
    //   const signInData = await fakeRequest(app)
    //     .post('/auth/signup')
    //     .send({
    //       email: 'jon@user.com',
    //       password: '1234'
    });
      
    //   token = signInData.body.token; // eslint-disable-line
    // }, 10000);
  
    afterAll(done => {
      return client.end(done);
    });

    test('returns categories', async() => {

      const expectation = [
        {
          id: 1,
          role: 'helicopter pilot',
        },
        {
          id: 2,
          role: 'mechanic',
        },
        {
          id: 3,
          role: 'biologist',
        },
        {
          id: 4,
          role: 'dog handler',
        },
        {
          id: 5,
          role: 'geologist',
        }
      ];

      const data = await fakeRequest(app)
        .get('/categories')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });

    test('returns quotes', async() => {

      const expectation = [
        {
          id: 1,
          name: 'MacReady',
          role: 'helicopter pilot',
          quote: 'I know I\'m human. And if you were all these Things, then you\'d just attack me right now, so I know some of you are still human.',
          known_thing: false,
          outpost: 31
        },
        {
          id: 7,
          name: 'Childs',
          role: 'mechanic',
          quote: 'Cut me loose, dammit!',
          known_thing: false,
          outpost: 31
        },
        {
          id: 2,
          name: 'Palmer',
          role: 'mechanic',
          quote: 'I was wondering when El Capitan was gonna get a chance to use his popgun.',
          known_thing: true,
          outpost: 31
        },
        {
          id: 4,
          name: 'Blair',
          role: 'biologist',
          quote: 'You see, what we\'re talkin\' about here is an organism that imitates other life-forms, and it imitates \'em perfectly. When this thing attacked our dogs it tried to digest them... absorb them, and in the process shape its own cells to imitate them.',
          known_thing: true,
          outpost: 31
        },
        {
          id: 3,
          name: 'Fuchs',
          role: 'biologist',
          quote: 'It could have imitated a million life forms on a million planets. It could change into any one of them at any time. Now, it wants life forms on Earth.',
          known_thing: false,
          outpost: 31
        },
        {
          id: 5,
          name: 'Clark',
          role: 'dog handler',
          quote: 'I dunno what the hell\'s in there, but it\'s weird and pissed off, whatever it is.',
          known_thing: false,
          outpost: 31
        },
        {
          id: 6,
          name: 'Norris',
          role: 'geologist',
          quote: 'I\'d say the ice this thing is buried in is 100,000 years old... At least.',
          known_thing: true,
          outpost: 31
        } 
      ];

      const data = await fakeRequest(app)
        .get('/thingQuotes')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });
    
    test('returns quote', async() => {

      const expectation = 
      {
        id: 1,
        name: 'MacReady',
        role: 'helicopter pilot',
        quote: 'I know I\'m human. And if you were all these Things, then you\'d just attack me right now, so I know some of you are still human.',
        known_thing: false,
        outpost: 31
      };

      const data = await fakeRequest(app)
        .get('/thingQuotes/1')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });

    test('delete quote with id 6 and check database to verify quote was deleted', async() => {

      const expectation1 = 
      {
        id: 6,
        name: 'Norris',
        role_id: 5,
        quote: 'I\'d say the ice this thing is buried in is 100,000 years old... At least.',
        known_thing: true,
        outpost: 31
      };

      const expectation2 = [
        {
          id: 1,
          name: 'MacReady',
          role: 'helicopter pilot',
          quote: 'I know I\'m human. And if you were all these Things, then you\'d just attack me right now, so I know some of you are still human.',
          known_thing: false,
          outpost: 31
        },
        {
          id: 7,
          name: 'Childs',
          role: 'mechanic',
          quote: 'Cut me loose, dammit!',
          known_thing: false,
          outpost: 31
        },
        {
          id: 2,
          name: 'Palmer',
          role: 'mechanic',
          quote: 'I was wondering when El Capitan was gonna get a chance to use his popgun.',
          known_thing: true,
          outpost: 31
        },
        {
          id: 4,
          name: 'Blair',
          role: 'biologist',
          quote: 'You see, what we\'re talkin\' about here is an organism that imitates other life-forms, and it imitates \'em perfectly. When this thing attacked our dogs it tried to digest them... absorb them, and in the process shape its own cells to imitate them.',
          known_thing: true,
          outpost: 31
        },
        {
          id: 3,
          name: 'Fuchs',
          role: 'biologist',
          quote: 'It could have imitated a million life forms on a million planets. It could change into any one of them at any time. Now, it wants life forms on Earth.',
          known_thing: false,
          outpost: 31
        },
        {
          id: 5,
          name: 'Clark',
          role: 'dog handler',
          quote: 'I dunno what the hell\'s in there, but it\'s weird and pissed off, whatever it is.',
          known_thing: false,
          outpost: 31
        }];

      const data1 = await fakeRequest(app)
        .delete('/thingQuotes/6')
        .expect('Content-Type', /json/)
        .expect(200);

      const data2 = await fakeRequest(app)
        .get('/thingQuotes')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data1.body).toEqual(expectation1);
      expect(data2.body).toEqual(expectation2);
    });

    test('post quote', async() => {

      const expectation = [
        {
          id: expect.any(Number),
          name: 'Nauls',
          role_id: 1,
          quote: 'Maybe we at war with Norway now.',
          known_thing: false,
          outpost: 31
        }
      ];

      const data = await fakeRequest(app)
        .post('/thingQuotes')
        .send({
          name: 'Nauls',
          role_id: 1,
          quote: 'Maybe we at war with Norway now.',
          known_thing: false
        })
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });

    test('update quote', async() => {

      const expectation = 
        {
          id: 5,
          name: 'Clark',
          role_id: 4,
          quote: 'I say a lot of things.',
          known_thing: true,
          outpost: 31
        }
      ;

      const data = await fakeRequest(app)
        .put('/thingQuotes/5')
        .send({
          name: 'Clark',
          role_id: 4,
          quote: 'I say a lot of things.',
          known_thing: true
        })
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });

  });
});
