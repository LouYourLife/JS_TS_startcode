// Old, won't be used anymore

//import express from "express";
import { Router } from "express";
const router = Router();
import {ApiError} from "../errors/apiError";
import authMiddleware from "../middleware/basic-auth";
import facade from '../facades/DummyDB-Facade';
// import mycors from "../middleware/myCors";
// const cors = require('cors');


router.use(authMiddleware);

//router.use(express.json());

router.get("/all", async (req, res) => {
    const friends = await facade.getAllFriends();
    const friendDTO = friends.map(friend => {
        const {firstName, lastName} = friend;
        return {firstName: firstName, lastName};
    });
    res.json(friendDTO);
});

router.get("/findby-username/:userid", async (req, res, next) => {
    const userId = req.params.userid;
    try {
        const friend = await facade.getFrind(userId);
        if (friend == null) {
            throw new ApiError("user not found", 404)
        }
        const { firstName, lastName, email } = friend;
        const friendDTO = { firstName, lastName, email }
        res.json(friendDTO);
    } catch (err) {
        next(err)
    }
})
  

export default router;