import { gql } from "https://deno.land/x/oak_graphql@0.6.2/mod.ts";


const Schema = gql`

  type Match {
    team1: String!
    team2: String!
    score: String!
    minute: Number!
    token: String
    finished: Boolean!
  }

  type User {
    name: String!
    email: String!
    password: String!
    token: String
    posts: [Post!] 
  }

  type Subscription {
    user: User!
    match: Match!
    postCreated: Post
  }

  type Query {
    getMatch(_id: String!): Match
    listMatches: [Match!]!
    
  }
  type Mutation {
    registroUsuario(email: String!, password: String!): Boolean!
    login(email: String!, password: String!): String!
    logout: Boolean!
    startMatch(team1: String!, team2: String!): Boolean!
    setMatchData(id: ID!, score: String, minute: Int, finished: boolean)
    subscribeMatch(_id: String!): Subscription
  }
`;

export { Schema };
