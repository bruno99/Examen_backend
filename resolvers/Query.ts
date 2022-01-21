import {
  Database
} from "https://deno.land/x/mongo@v0.12.1/mod.ts";
import {
  GQLError,
} from "https://deno.land/x/oak_graphql@0.6.2/mod.ts";

 import { UserSchema, MatchSchema, SuscriptionSchema } from "../mongo/schema.ts";

 import { IContext } from "../types.ts";


 const Query = {
  //GETMATCH 
  getMatch: async (
    parent: any,
    args: { _id: string },
    ctx: IContext,
    info: any
  ) => {
    const db: Database = ctx.db;
    const matches = db.collection<MatchSchema>("MatchCollection");
    return await matches.findOne({ _id: { $oid: args._id } });
  },
  //LISTMATCHES
   listMaches: async (parent: any, args: any, ctx: IContext) => {
     try {
       const db: Database = ctx.db;
       const matchesCollection = db.collection<MatchSchema>("MatchCollection");
       const matches = await matchesCollection.find({});
       return matches;
     } catch (e) {
       throw new GQLError(e);
     }
   },
 };

 export {Query}
