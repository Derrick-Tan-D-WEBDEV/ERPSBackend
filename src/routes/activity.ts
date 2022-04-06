import e, { Router } from "express";
import moment from "moment";
import { SP_Category } from "../entity/SP_Category";
import { getConnection, getManager, Like } from "typeorm";
import { StandardParts } from "../entity/SP";

import { LoggerService } from "../LoggerService";
import { PendingParts } from "../entity/SP_Pending";
import { ActivityLog } from "../entity/ActivityLog";
import { User } from "../entity/User";
import argon2 from "argon2";
import { SP_UomTypes } from "../entity/SP_Uom";
import { FormSettings } from "../entity/FormSettings";

const logger = new LoggerService("activity-log-api");
const ActivityLogRouter = Router();
const AcitivtyLogManager = getManager("standardPartsDB");

ActivityLogRouter.get("/getAllActivityLog", async (_req, res) => {
    try {
        await AcitivtyLogManager.createQueryBuilder(ActivityLog, "AL")
                                .innerJoinAndSelect("AL.user", "U")
                                .innerJoinAndSelect("AL.sp", "SP")
                                .select(["AL.id AS id", "AL.timelog AS timelog", "AL.title AS title", "AL.description AS description"])
                                .addSelect("U.fullname AS fullname")
                                .addSelect(["SP.erp_code AS erp_code", "SP.product_part_number AS product_part_number"])
                                .getRawMany()
        .then((data) => {
            logger.info_obj("API: " + "/getAllActivityLog", {
                message: "API Done",
                total: data.length,
                status: true,
            });
            res.send({ data, total: data.length, status: true });
        })
        .catch((e) => {
            logger.error_obj("API: " + "/getAllActivityLog", {
                message: "API Error: " + e,
                status: false,
            });
            res.send({ message: e, status: false });
        })
    }
    catch(e) {
        logger.error_obj("API: " + "/getAllActivityLog", {
            message: "API Failed: " + e,
            status: false,
        });
        res.send({ message: e, status: false });
    }
})

ActivityLogRouter.post("/getActivityLogByPartId", async (req, res) => {
    const { part_id } = req.body;
    try {
        await AcitivtyLogManager.createQueryBuilder(ActivityLog, "AL")
                                .innerJoinAndSelect("AL.user", "U")
                                .innerJoinAndSelect("AL.sp", "SP")
                                .select(["AL.id AS id", "AL.timelog AS timelog", "AL.title AS title", "AL.description AS description"])
                                .addSelect("U.fullname AS fullname")
                                .addSelect(["SP.erp_code AS erp_code", "SP.product_part_number AS product_part_number"])
                                .where(`AL.std_part_id = ${ part_id }`)
                                .orderBy("AL.timelog", "DESC")
                                .getRawMany()
        .then((data) => {
            logger.info_obj("API: " + "/getActivityLogByPartId", {
                message: "API Done",
                total: data.length,
                status: true,
            });
            res.send({ data, total: data.length, status: true });
        })
        .catch((e) => {
            logger.error_obj("API: " + "/getActivityLogByPartId", {
                message: "API Error: " + e,
                status: false,
            });
            res.send({ message: e, status: false });
        })

    }
    catch(e) {
        logger.error_obj("API: " + "/getActivityLogByPartId", {
            message: "API Failed: " + e,
            status: false,
        });
        res.send({ message: e, status: false });
    }
})

ActivityLogRouter.post("/getOneActivityLog", async (req, res) => {
    const { id } = req.body;
    try {
        await AcitivtyLogManager.createQueryBuilder(ActivityLog, "AL")
                                .innerJoinAndSelect("AL.user", "U")
                                .innerJoinAndSelect("AL.sp", "SP")
                                .select(["AL.id AS id", "AL.timelog AS timelog", "AL.title AS title", "AL.description AS description"])
                                .addSelect("U.fullname AS fullname")
                                .addSelect(["SP.erp_code AS erp_code", "SP.product_part_number AS product_part_number"])
                                .where(`AL.id = ${ id }`)
                                .getRawOne()
        .then((data) => {
            logger.info_obj("API: " + "/getOneActivityLog", {
                message: "API Done",
                data: id,
                status: true,
            });
            res.send({ data, total: data.length, status: true });
        })
        .catch((e) => {
            logger.error_obj("API: " + "/getOneActivityLog", {
                message: "API Error: " + e,
                data: id,
                status: false,
            });
            res.send({ message: e, status: false });
        })
    }
    catch(e) {
        logger.error_obj("API: " + "/getOneActivityLog", {
            message: "API Failed: " + e,
            data: id,
            status: false,
        });
        res.send({ message: e, status: false });
    }
})

module.exports = ActivityLogRouter