import bodyParser from 'body-parser';
import { IUser } from 'types/app.types';
declare global {
  namespace Express {
    interface Request {
      currentUser: IUser;
    }
  }
}
declare module 'body-parser' {
  let parser: typeof bodyParser & { xml: () => Record<any, never> };
  export default parser;
}
