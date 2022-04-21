import e, { Router } from "express";
import moment from "moment";
import { SP_Category } from "../entity/SP_Category";
import { getConnection, getManager, Like } from "typeorm";
import { StandardParts } from "../entity/SP";
import { SP_TypeItems } from "../entity/SP_TypeItem";
import { LoggerService } from "../LoggerService";
import { PendingParts } from "../entity/SP_Pending";
import { ActivityLog } from "../entity/ActivityLog";
import { UserIcon } from "../entity/UserIcon";
import { User } from "../entity/User";
import argon2 from "argon2";
import { createAccessToken } from "../auth";
import { platform } from "os";
import { Console } from "console";

const logger = new LoggerService("icons-api");
const IconRouter = Router();
const IconManager = getManager("standardPartsDB");

IconRouter.get("/", async (_req, res) => {
  res.send({ message: "Icons Connected", status: true });
});

IconRouter.post("/addUserIcon", async (req, res) => {
    const { user_id, data } = req.body;
    try {
        const {
            accessory,
            body,
            circleColor,
            clothing,
            clothingColor,
            eyebrows,
            eyes,
            facialHair,
            graphic,
            hair,
            hairColor,
            hat,
            hatColor,
            lashes,
            lipColor,
            mask,
            faceMask,
            mouth,
            skinTone,
            faceMaskColor
        } = data;

        const checkUser = await IconManager.findOne(UserIcon, { user_id })

        if (checkUser !== undefined) {
            logger.error_obj("API: " + "/addUserIcon", {
                message:
                  "API Error: " +
                  `Redundant on Employee ID ${user_id}.`,
                value: user_id,
                status: false,
            });
            return res.send({
                message: `Redundant on Employee ID ${user_id}.`,
                status: false,
            });
        }

        const mainResult = {
            accessory,
            body,
            circleColor,
            clothing,
            clothingColor,
            eyebrows,
            eyes,
            facialHair,
            graphic,
            hair,
            hairColor,
            hat,
            hatColor,
            lashes,
            lipColor,
            mask,
            faceMask,
            mouth,
            skinTone,
            faceMaskColor,
            user_id,
            status : 1
        }

        await IconManager.insert(UserIcon, mainResult)
        .then((data) => {
            logger.info_obj("API: " + "/addUserIcon", {
                message: "API Done",
                main: data,
                status: true,
            });
            res.send({
                data: `Insert Successfully`,
                main: data,
                status: true,
            });
        })
        .catch((e) => {
            logger.error_obj("API: " + "/addUserIcon", {
                message: "API Error" + e,
                value: mainResult,
                status: false,
            });
            res.send({ data: `Error On Insert To DB: ` + e, status: false });
        })
    }
    catch(e) {
        logger.error_obj("API: " + "/addUserIcon", {
            message: "API Failed: " + e,
            value: data,
            status: false,
        });
        res.send({ message: e, status: false });
    }
})

IconRouter.post("/editUserIcon", async (req, res) => {
    const { user_id, data } = req.body;
    try {
        const {
            accessory,
            body,
            circleColor,
            clothing,
            clothingColor,
            eyebrows,
            eyes,
            facialHair,
            graphic,
            hair,
            hairColor,
            hat,
            hatColor,
            lashes,
            lipColor,
            mask,
            faceMask,
            mouth,
            skinTone,
            faceMaskColor
        } = data;

        const checkUser = await IconManager.findOne(UserIcon, { user_id })

        if (checkUser === undefined) {
            const mainResult = {
                accessory,
                body,
                circleColor,
                clothing,
                clothingColor,
                eyebrows,
                eyes,
                facialHair,
                graphic,
                hair,
                hairColor,
                hat,
                hatColor,
                lashes,
                lipColor,
                mask,
                faceMask,
                mouth,
                skinTone,
                faceMaskColor,
                user_id,
                status : 1
            }
    
            await IconManager.insert(UserIcon, mainResult)
            .then((data) => {
                logger.info_obj("API: " + "/editUserIcon", {
                    message: "API Done",
                    main: data,
                    status: true,
                });
                res.send({
                    data: `Insert Successfully`,
                    main: data,
                    status: true,
                });
            })
            .catch((e) => {
                logger.error_obj("API: " + "/editUserIcon", {
                    message: "API Error" + e,
                    value: mainResult,
                    status: false,
                });
                res.send({ data: `Error On Insert To DB: ` + e, status: false });
            })
        }

        await IconManager.update(UserIcon, { user_id }, {
            accessory,
            body,
            circleColor,
            clothing,
            clothingColor,
            eyebrows,
            eyes,
            facialHair,
            graphic,
            hair,
            hairColor,
            hat,
            hatColor,
            lashes,
            lipColor,
            mask,
            faceMask,
            mouth,
            skinTone,
            faceMaskColor,
        })
        .then((data) => {
            logger.info_obj("API: " + "/editUserIcon", {
                message: "API Done",
                data,
                status: true,
            });
            res.send({
                data,
                status: true,
            });
        })
        .catch((e) => {
            logger.error_obj("API: " + "/editUserIcon", {
                message: "API Error" + e,
                value: data,
                status: false,
            });
            res.send({ data: `Error On Update To DB: ` + e, status: false });
        })
    }
    catch(e) {
        logger.error_obj("API: " + "/editUserIcon", {
            message: "API Failed: " + e,
            value: data,
            status: false,
        });
        res.send({ message: e, status: false });
    }
})

IconRouter.post("/getUserIcon", async (req, res) => {
    const { user_id } = req.body;
    try {
        const checkIcon = await IconManager.findOne(UserIcon, { user_id })

        if (checkIcon === undefined) {
            const mainIcon = {
                accessory : "shades",
                body: "breasts",
                circleColor: "blue",
                clothing: "tankTop",
                clothingColor: "black",
                eyebrows: "angry",
                eyes: "wink",
                facialHair: "mediumBeard",
                graphic: "vue",
                hair: "beanie",
                hairColor: "black",
                hat: "green",
                hatColor: "green",
                lashes: "false",
                lipColor: "purple",
                mask: "true",
                faceMask: "true",
                mouth: "open",
                skinTone: "brown",
                faceMaskColor: "blue",
                user_id,
                status : 1
            }
            logger.info_obj("API: " + "/getUserIcon", {
                message: "API Done [USER ICON NOT FOUND]",
                main: mainIcon,
                status: true,
            });
            res.send({
                data: `Get Default Icon Successfully`,
                main: mainIcon,
                status: true,
            });

        }
        else {
            logger.info_obj("API: " + "/getUserIcon", {
                message: "API Done",
                main: checkIcon,
                status: true,
            });
            res.send({
                data: `Get Successfully`,
                main: checkIcon,
                status: true,
            });
        }
        // .catch((e) => {
        //     logger.error_obj("API: " + "/getUserIcon", {
        //         message: "API Error" + e,
        //         value: user_id,
        //         status: false,
        //     });
        //     res.send({ data: `Unable to get data from DB: ` + e, status: false });
        // })
    }
    catch(e) {
        logger.error_obj("API: " + "/getUserIcon", {
            message: "API Failed: " + e,
            value: user_id,
            status: false,
        });
        res.send({ message: e, status: false });
    }
})

module.exports = IconRouter;