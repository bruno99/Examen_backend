import { Collection, Database } from "https://deno.land/x/mongo@v0.12.1/mod.ts";
import { GQLError } from "https://deno.land/x/oak_graphql@0.6.2/mod.ts";
import { UserSchema, MatchSchema, SuscriptionSchema} from "../mongo/schema.ts";
import { IContext} from "../types.ts";
import { v4 } from "https://deno.land/std/uuid/mod.ts";

interface ICreateMatchArgs {
    team1: string;
    team2: string;
    score: string;
    minute: string;
    finished: string;
}

interface ICreateUserArgs {
  email: string;
  password: string;
}

const Mutation = {
  registroUsuario: async (
    parent: any,
    args: ICreateUserArgs,
    ctx: IContext
  ): Promise<boolean> => {
    try {
      const db: Database = ctx.db;
      const UsersCollection: Collection<UserSchema> = db.collection<UserSchema>(
        "UserCollection"
      );

      const found = await UsersCollection.findOne({ email: args.email });
      if (found) throw new GQLError("user with email already in DB");
      {
        await UsersCollection.insertOne({ ...args });
        return true;
      }
      return false;
    } catch (e) {
      throw new GQLError(e);
    }
  },
  login: async (
    parent: any,
    args: { email: string; password: string },
    ctx: IContext
  ): Promise<string> => {
    try {
      const exists = await ctx.db
        .collection<UserSchema>("UserCollection")
        .findOne({ email: args.email, password: args.password });
      if (exists) {
        const token = v4.generate();
        await ctx.db
          .collection<UserSchema>("UserCollection")
          .updateOne({ email: args.email }, { $set: { token } });
        setTimeout(() => {
          ctx.db
            .collection<UserSchema>("UserCollection")
            .updateOne({ email: args.email }, { $set: { token: "" } });
        }, 60 * 60 * 1000);
        return token;
      } else {
        throw new GQLError("User and password do not match");
      }
    } catch (e) {
      throw new GQLError(e);
    }
  },

  logout: async (parent: any, args: {}, ctx: IContext): Promise<boolean> => {
    try {
      const exists = await ctx.db
        .collection<UserSchema>("UserCollection")
        .findOne({ email: ctx.user.email, token: ctx.user.token });
      if (exists) {
        await ctx.db
          .collection<UserSchema>("UserCollection")
          .updateOne({ email: ctx.user.email }, { $set: { token: "" } });
        return true;
      } else {
        throw new GQLError("Unexpected error");
      }
    } catch (e) {
      throw new GQLError(e);
    }
  },

  //SETMATCHDATA
  setMatchData: async (
    parent: any,
    args: { finished: string },
    ctx: IContext
  ): Promise<boolean> => {
    try {
      const db: Database = ctx.db;
      const matchesCollection: Collection<MatchSchema> = db.collection<MatchSchema>(
        "MatchCollection"
      );
      if(ctx.math.score > 0 || ctx.match.minutes > 0){//datos coherentes
      await matchesCollection.updateOne(
        { score: ctx.match.score },
        { minute: ctx.match.minute },
        
      );
     }
      if(ctx.match.minute>90){//terminar el partido cuando se llega a 90 minutos 
        await matchesCollection.updateOne(
          { $set: { finished: args.finished } }
        );
      }

      return true;
    } catch (e) {
      throw new GQLError(e);
    }
  },
  //STARTMATCH
  startMatch: async (
    parent: any,
    args: {
      finished: string;
    },
    ctx: IContext
  ) => {
    try {
      const db: Database = ctx.db;
      const matchesCollection: Collection<MatchSchema> = db.collection<MatchSchema>("MatchCollection");
      const match = await matchesCollection.findOne({ finished: true, minutes: 0! , id: ctx.match.id });//comprobamos que ese id no es un partido en proceso o ya terminado
      if (match) {
        throw new GQLError("Match already exists");
      } else {
        const match = await matchesCollection.insertOne({ team1: ctx.match.team1, team2: ctx.match.team2, minute: 0, score: "0-0", finished: false});//creamos partido nuevo      return match;

      }
      
    } catch (e) {
      throw new GQLError(e);
    }
  },
  //SUSCRIBEMATCH
  subscribeMatch: async (
    parent: any,
    args: {
      id: string;
    },
    ctx: IContext
  ) => {
    try {
      const db: Database = ctx.db;
      const usersCollection: Collection<UserSchema> = db.collection<UserSchema>("UserCollection");
      const matchesCollection: Collection<MatchSchema> = db.collection<MatchSchema>("MatchCollection");

      const match = await matchesCollection.findOne({ finised: false, id: ctx.match.id });//comprobamos que partido existe
      const user = await usersCollection.findOne({  id: ctx.user.id}) //comprobamos que suer existe
      if (match || user) {
        return match;//devolvemo los datos del partido
      } else {
        throw new GQLError("Usuario o partido no encontrado");
      }      
    } catch (e) {
      throw new GQLError(e);
    }
  },
};

export { Mutation }
