import { Database } from "https://deno.land/x/mongo@v0.12.1/mod.ts";

export interface IMatch {
  _id: { $oid: string };
  team1: string;
  team2: string;
  score: string;
  minute: number;
  token: string;
  finished: boolean;
}
export interface IUser {
  name: string;
  email: string;
  token: string;
}
export interface ISuscription{
  _id: { $oid: string };
  user: string;
  match: string;
}
export interface IContext {
  db: Database;
  match: IMatch;
}
