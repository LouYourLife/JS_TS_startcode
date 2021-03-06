import FriendFacade from '../facades/friendFacade';
import { IFriend } from '../interfaces/IFriend';
import { ApiError } from '../errors/apiError';
import { Request } from "express";
import fetch from "node-fetch"



let friendFacade: FriendFacade;

/*
We don't have access to app or the Router so we need to set up the facade in another way
In www.ts IMPORT and CALL the method below, like so: 
      setupFacade(db);
Just before the line where you start the server
*/
export function setupFacade(db: any) {
  if (!friendFacade) {
    friendFacade = new FriendFacade(db)
  }
}

// resolver map
export const resolvers = {
  Query: {

    getAllFriends: (root: any, _: any, context: any) => {
      /*
      if (!context.credentials.role || context.credentials.role !== "admin") {
        throw new ApiError("Not Authorized", 401)
      }
      */
      return friendFacade.getAllFriendsV2()

    },

    getAllFriendsProxy: async (root: object, _: any, context: Request) => {

      let options: any = { method: "GET" }

      //This part only required if authentication is required
      const auth = context.get("authorization");
      if (auth) {
        options.headers = { 'authorization': auth }
      }
      return fetch(`http://localhost:${process.env.PORT}/api/friends/all`, options).then(r => {
        if (r.status >= 400) { throw new Error(r.statusText) }
        return r.json()
      })
    },

    getFriendByEmail: (root: any, { input }: { input: string }) => {
        const friend = friendFacade.getFriendFromEmail(input);
        return friend;
    },

    getFriendById: (root: any, { input }: { input: string }) => {
        const friend = friendFacade.getFriendFromId(input);
        return friend;
    }
  },

  Mutation: {
    createFriend: async (_: object, { input }: { input: IFriend }) => {
      return friendFacade.addFriendV2(input)
    },

    editFriend: async (_: object, { input }: { input: IFriend }) => {
        const mail = input.email;
        const edited = friendFacade.editFriendV2(mail, input);
        return edited;
    },
    deleteFriend: async (_: object, { input }: { input: string }) => {
        const deleted = friendFacade.deleteFriendV2(input);
        return deleted;
    }
  },
};