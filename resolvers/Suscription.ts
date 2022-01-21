import { Database } from "https://deno.land/x/mongo@v0.12.1/mod.ts";
import { UserSchema, MatchSchema } from "../mongo/schema.ts";
import { IContext} from "../types.ts";


const Suscription = {

  match: async (
    parent: { id: string },
    args: any,
    ctx: IContext
  ) => {
    const db: Database = ctx.db;
    const matchCollection = db.collection<MatchSchema>("MatchCollection");
    return await matchCollection.findOne({
      id: ctx.match.id,
    });
  } ,

  user: async (
    parent: { id: string },
    args: any,
    ctx: IContext
  ) => {
    const db: Database = ctx.db ;
    const UsersCollection = db.collection<UserSchema>("UserCollection");
    return await UsersCollection.findOne({
      email: ctx.user.email,
    });
  },

  

};
  
export { Suscription };
