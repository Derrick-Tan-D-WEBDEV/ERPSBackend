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
import { Router } from "express";
import { DMTParts } from "../entity/DMT";

const logger = new LoggerService("dmt-api");
const DMTRouter = Router();
const DMTManager = getManager("standardPartsDB");

DMTRouter.get("/", async (_req, res) => {
    res.send("Connect To DMT Successfully.");
})

DMTRouter.get("/getAllDMTs", async (_req, res) => {
    try {
        await DMTManager.createQueryBuilder(DMTParts, "DMT")
                        .select(["DMT.id AS id", "DMT.partNum AS partNum"])
                        .addSelect(
                            "CASE WHEN DMT.status = 1 then 'Show' else 'Hide' end",
                            "status"
                        )
                        .getRawMany()
        .then((data) => {
            logger.info_obj("API: " + "/getAllDMTs", {
                message: "API Done",
                total: data.length,
                status: true,
            });
            res.send({ data, total: data.length, status: true });
        })
        .catch((e) => {
            logger.error_obj("API: " + "/getAllDMTs", {
                message: "API Error: " + e,
                status: false,
            });
            res.send({ message: e, status: false });
        })
    }
    catch(e) {
        logger.error_obj("API: " + "/getAllDMTs", {
            message: "API Failed: " + e,
            status: false,
        });
        res.send({ message: e, status: false });
    }
})

DMTRouter.get("/getAllDMT", async (_req, res) => {
    try {
        await DMTManager.createQueryBuilder(DMTParts, "DMT")
                        .select(["DMT.id AS id", "DMT.partNum AS partNum"])
                        .addSelect(
                            "CASE WHEN DMT.status = 1 then 'Show' else 'Hide' end",
                            "status"
                        )
                        .where("DMT.status = 1")
                        .getRawMany()
        .then((data) => {
            logger.info_obj("API: " + "/getAllDMT", {
                message: "API Done",
                total: data.length,
                status: true,
            });
            res.send({ data, total: data.length, status: true });
        })
        .catch((e) => {
            logger.error_obj("API: " + "/getAllDMT", {
                message: "API Error: " + e,
                status: false,
            });
            res.send({ message: e, status: false });
        })
    }
    catch(e) {
        logger.error_obj("API: " + "/getAllDMT", {
            message: "API Failed: " + e,
            status: false,
        });
        res.send({ message: e, status: false });
    }
})

DMTRouter.post("/getOneDMT", async (req, res) => {
    const { id } = req.body;
    try {
        await DMTManager.createQueryBuilder(DMTParts, "DMT")
                        .select(["DMT.id AS id", "DMT.partNum AS partNum"])
                        .addSelect(
                            "CASE WHEN DMT.status = 1 then 'Show' else 'Hide' end",
                            "status"
                        )
                        .where("DMT.status = 1")
                        .andWhere(`DMT.id = ${ id }`)
                        .getRawOne()
        .then((data) => {
            logger.info_obj("API: " + "/getOneDMT", {
                message: "API Done",
                total: data.length,
                status: true,
            });
            res.send({ data, total: data.length, status: true });
        })
        .catch((e) => {
            logger.error_obj("API: " + "/getOneDMT", {
                message: "API Error: " + e,
                status: false,
            });
            res.send({ message: e, status: false });
        })
    }
    catch(e) {
        logger.error_obj("API: " + "/getOneDMT", {
            message: "API Failed: " + e,
            status: false,
        });
        res.send({ message: e, status: false });
    }
})

DMTRouter.post("/getDeletedDMT", async (_req, res) => {
    try {
        await DMTManager.createQueryBuilder(DMTParts, "DMT")
                        .select(["DMT.id AS id", "DMT.partNum AS partNum"])
                        .addSelect(
                            "CASE WHEN DMT.status = 1 then 'Show' else 'Hide' end",
                            "status"
                        )
                        .where("DMT.status = 0")
                        .getRawMany()
        .then((data) => {
            logger.info_obj("API: " + "/getDeletedDMT", {
                message: "API Done",
                total: data.length,
                status: true,
            });
            res.send({ data, total: data.length, status: true });
        })
        .catch((e) => {
            logger.error_obj("API: " + "/getDeletedDMT", {
                message: "API Error: " + e,
                status: false,
            });
            res.send({ message: e, status: false });
        })
    }
    catch(e) {
        logger.error_obj("API: " + "/getDeletedDMT", {
            message: "API Failed: " + e,
            status: false,
        });
        res.send({ message: e, status: false });
    }
})

DMTRouter.post("/addDMT", async (req, res) => {
    const { partNum } = req.body;
    try {
        const checkRedundant = await DMTManager.findOne(DMTParts, { partNum })

        if (checkRedundant !== undefined) {
            logger.error_obj("API: " + "/addDMT", {
                message: "API Error: " + `Duplication on ${partNum}.`,
                status: false,
            });
            return res.send({
                message: `Duplication on ${partNum}.`,
                status: false,
            });
        }

        const mainResult = {
            partNum : partNum,
            status : 1
        }

        await DMTManager.insert(DMTParts, mainResult)
        .then((data) => {
            logger.info_obj("API: " + "/addDMT", {
                message: "API Done",
                value : mainResult,
                status: true,
            });
            res.send({ data, value : data, status : true });
        })
        .catch((e) => {
            logger.error_obj("API: " + "/addDMT", {
                message: "API Error: " + e,
                value : mainResult,
                status: false,
            });
            res.send({ message: e, status: false });
        })
    }
    catch(e) {
        logger.error_obj("API: " + "/addDMT", {
            message: "API Failed: " + e,
            value : partNum,
            status: false,
        });
        res.send({ message: e, status: false });
    }
})

DMTRouter.post("/editDMT", async (req, res) => {
    const { id, partNum } = req.body;
    try {
        const checkRedundant = await DMTManager.findOne(DMTParts, { partNum })

        if (checkRedundant !== undefined) {
            logger.error_obj("API: " + "/editDMT", {
                message: "API Error: " + `Duplication on ${partNum}.`,
                status: false,
            });
            return res.send({
                message: `Duplication on ${partNum}.`,
                status: false,
            });
        }

        await DMTManager.update(DMTParts, { id },
            {
                partNum : partNum
            }
        )
        .then((data) => {
            logger.info_obj("API: " + "/editDMT", {
                message: "API Done",
                value : { id, partNum } ,
                status: true,
            });
            res.send({ data, value : data, status : true });
        })
        .catch((e) => {
            logger.error_obj("API: " + "/editDMT", {
                message: "API Error: " + e,
                value : { id, partNum },
                status: false,
            });
            res.send({ message: e, status: false });
        })
    }
    catch(e) {
        logger.error_obj("API: " + "/editDMT", {
            message: "API Failed: " + e,
            value : { id, partNum },
            status: false,
        });
        res.send({ message: e, status: false });
    }
})

DMTRouter.post("/deleteDMT", async (req, res) => {
    const { id } = req.body;
    try {
        const dmt = DMTManager.findOne(DMTParts, { id })

        if (dmt === undefined) {
            logger.error_obj("API: " + "/deleteDMT", {
                message: "API Error: Id Not Found",
                value: { id },
                status: false,
              });
              res.send({ data: "API Error: Id Not Found", status: false });
        }

        await DMTManager.update(DMTParts, { id }, 
            {
                status : 0
            }
        )
        .then((data) => {
            logger.info_obj("API: " + "/deleteDMT", {
                message: "API Done",
                main: data,
                status: true,
              });
              res.send({ data: `Delete Successfully`, main: data, status: true });
        })
        .catch((e) => {
            logger.error_obj("API: " + "/deleteDMT", {
                message: "API Error" + e,
                value: { id },
                status: false,
              });
              res.send({ data: `Error On Delete To DB: ` + e, status: false });
        })
    }
    catch(e) {
        logger.error_obj("API: " + "/deleteDMT", {
            message: "API Failed: " + e,
            value: { id },
            status: false,
          });
          res.send({ message: e, status: false });
    }
})

DMTRouter.post("/recoverDMT", async (req, res) => {
    const { id } = req.body;
    try {
        const dmt = DMTManager.findOne(DMTParts, { id })

        if (dmt === undefined) {
            logger.error_obj("API: " + "/recoverDMT", {
                message: "API Error: Id Not Found",
                value: { id },
                status: false,
              });
              res.send({ data: "API Error: Id Not Found", status: false });
        }

        await DMTManager.update(DMTParts, { id }, 
            {
                status : 1
            }
        )
        .then((data) => {
            logger.info_obj("API: " + "/recoverDMT", {
                message: "API Done",
                main: data,
                status: true,
              });
              res.send({ data: `Recover Successfully`, main: data, status: true });
        })
        .catch((e) => {
            logger.error_obj("API: " + "/recoverDMT", {
                message: "API Error" + e,
                value: { id },
                status: false,
              });
              res.send({ data: `Error On Recover At DB: ` + e, status: false });
        })
    }
    catch(e) {
        logger.error_obj("API: " + "/recoverDMT", {
            message: "API Failed: " + e,
            value: { id },
            status: false,
          });
          res.send({ message: e, status: false });
    }
})

module.exports = DMTRouter