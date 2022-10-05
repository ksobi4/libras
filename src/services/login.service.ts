import admin  from 'firebase-admin';
import jwt  from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

import clientHandler from '../crawler/handler';
import config from '../config/config'
import Crawler from '../crawler/crawler';
import { jwtData } from '../types/jwtData';
import { db } from '../utils/init_database';

const jwtKey = config.JWT_private_key;

export async function getToken(login: string, password:string): Promise<string>{
  
  try {
    const tempClient:Crawler = new Crawler();
    await tempClient.auth(login, password);
    clientHandler.addClient(tempClient);

    const uuid:string = uuidv4();

    let userList = await db.collection('users')
                .where('login','==', login)
                .get();

    if(userList.empty) {
      await db.collection('users').doc(uuid).set({
        login: login
      })
    }

    var data:jwtData = {login: login, password: password, uuid: uuid};

    const token:string = await jwt.sign(
      data, 
      jwtKey, {  expiresIn:'30d' }
    )

    return token;


  } catch (e) {
    throw e;
  }
}
