import 'dotenv/config';
import { config, createSchema } from '@keystone-next/keystone/schema';
import {
  withItemData,
  statelessSessions,
} from '@keystone-next/keystone/session';
import { createAuth } from '@keystone-next/auth';
import { User } from './schemas/User';
import { Product } from './schemas/Product';
import { ProductImage } from './schemas/ProductImage';
import { insertSeedData } from './seed-data';

const databaseURL =
  process.env.DATABASE_URL || 'mongodb://localhost/keystone-sick-fits';

const sessionConfig = {
  maxAge: 60 * 60 * 24 * 360, // how long  they stay signed in?
  secret: process.env.COOKIE_SECRET,
};

const { withAuth } = createAuth({
  listKey: 'User',
  identityField: 'email',
  secretField: 'password',
  initFirstItem: {
    fields: ['name', 'email', 'password'],
  },
});

export default withAuth(
  config({
    server: {
      cors: {
        origin: [process.env.FRONTEND_URL],
        credentials: true,
      },
    },
    db: {
      adapter: 'mongoose',
      url: databaseURL,
      async onConnect(keystone) {
        console.log('Data base connected!');
        if (process.argv.includes('--seed-data')) {
          await insertSeedData(keystone);
        }
      },
    },
    lists: createSchema({
      // schema item go in here
      User,
      Product,
      ProductImage,
    }),
    ui: {
      isAccessAllowed: ({ session }) => {
        console.log(session);
        return !!session?.data;
      },
    },

    session: withItemData(statelessSessions(sessionConfig), {
      User: 'id email',
    }),
  })
);
