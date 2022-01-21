import { Database } from "https://deno.land/x/mongo@v0.12.1/mod.ts";
import { UserSchema, SuscriptionSchema, MatcherSchema } from "https://deno.land/./mongo/schema.ts";

interface IContext {
  db: Database;
}

const User = {
  user: async (parent: { email: string }, args: any, ctx: IContext) => {
    const db: Database = ctx.db;
        const usersCollection = db.collection<UserSchema>("UserCollection");
    return await usersCollection.findOne({ user: parent.email });
  },
  suscriptions: async (parent: { id: string }, args: any, ctx: IContext) => {
    const db: Database = ctx.db;
    const suscriptionsCollection = db.collection<SuscriptionSchema>("SuscriptionCollection");
    return await suscriptionsCollection.find({ suscription: parent.id });
  },
};

export { User };
