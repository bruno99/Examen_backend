
export interface MatchSchema {
  _id: { $oid: string };
  team1: string;
  team2: string;
  score: string;
  minute: number;
  token: string;
  finished: boolean;
}
export interface UserSchema {
  _id: { $oid: string },
  name: string,
  email: string,
  password: string,
  token: string,
}
export interface SuscriptionSchema {
  _id: { $oid: string };
  user: string;
  match: string; 
}

//nombre equipo 1 y 2, resultado (00-00), minuto de juego, finalizado (boolean)
