// const bcrypt = require('bcryptjs');
const client = require('../lib/client');
// import our seed data:
const thingQuotes = require('./thingQuotes.js');
const categories = require('./categories.js');
// const usersData = require('./users.js');
const { getEmoji } = require('../lib/emoji.js');
run();

async function run() {

  try {
    await client.connect();

    // const users = await Promise.all(
    //   usersData.map(user => {
    //     const hash = bcrypt.hashSync(user.password, 8);
    //     return client.query(`
    //                   INSERT INTO users (email, hash)
    //                   VALUES ($1, $2)
    //                   RETURNING *;
    //               `,
    //     [user.email, hash]);
    //   })
    // );
      
    // const user = users[0].rows[0];

    await Promise.all(
      categories.map(category => {
        return client.query(`
                    INSERT INTO categories (role)
                    VALUES ($1);
                `,
        [category.role]);
      })
    );

    await Promise.all(
      thingQuotes.map(quote => {
        return client.query(`
                    INSERT INTO thing_quotes (name, role_id, quote, known_thing, outpost)
                    VALUES ($1, $2, $3, $4, $5);
                `,
        [quote.name, quote.role_id, quote.quote, quote.knownThing, quote.outpost]);
      })
    );
    

    console.log('seed data load complete', getEmoji(), getEmoji(), getEmoji());
  }
  catch(err) {
    console.log(err);
  }
  finally {
    client.end();
  }
    
}
