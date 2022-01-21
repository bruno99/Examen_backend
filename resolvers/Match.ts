import { Database } from "https://deno.land/x/mongo@v0.12.1/mod.ts";
import { MatchSchema } from "../mongo/schema.ts";

interface IContext {
  db: Database;
}
const Match = {
  matches: async (parent: { id: string }, args: any, ctx: IContext) => {
    const db: Database = ctx.db;
    const matchesCollection = db.collection<MatchSchema>("MatchesCollection");
    return await await matchesCollection.find({
      match: parent.id,
    });
  },
};

export { Match };
