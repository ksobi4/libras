import express from 'express';


import logger from './utils/logger';
import routes from './routes';
import { initDB } from './utils/init_database';
import { antiSleeper } from './utils/anti_sleeper';
import { notificationIntervalChecker } from './controllers/notification.controller';


const PORT = process.env.PORT || 3001;

const app = express();


app.use(express.json());


async function main() {
  await app.listen(PORT)
  logger.info(`App runs at http://localhost:${PORT} 11`);
  await routes(app);  
  await initDB();
  

  antiSleeper();
  // notificationIntervalChecker();
  logger.info(`env = ${process.env.NODE_ENV}`)

}

main();