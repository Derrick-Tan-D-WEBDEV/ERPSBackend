import e, { Router } from "express";
import moment from "moment";
import { getConnection, getManager, Like } from "typeorm";
import { StandardParts } from "../entity/SP";

import { LoggerService } from "../LoggerService";
import { PendingParts } from "../entity/SP_Pending";
import { ActivityLog } from "../entity/ActivityLog";
import { User } from "../entity/User";
import argon2 from "argon2";
import { SP_UomTypes } from "../entity/SP_Uom";
import { NewsAnnouncement } from "../entity/News";

const logger = new LoggerService("category-api");
const SPNewsRouter = Router();
const NewsManager = getManager("standardPartsDB");

SPNewsRouter.get("/", async (_req, res) => {
  res.send("Connect To News Successfully.");
});

SPNewsRouter.get("/getAllNewss", async (_req, res) => {
  try {
    await NewsManager.createQueryBuilder(NewsAnnouncement, "News")
      .select(["News.id", "News.title", "News.content", "News.datetime"])
      .addSelect(
        "CASE WHEN News.status = 1 then 'Show' else 'Hide' end",
        "status"
      )
      .getRawMany()
      .then((data) => {
        logger.info_obj("API: " + "/getAllNewss", {
          message: "API Done",
          total: data.length,
          status: true,
        });
        res.send({ data, total: data.length, status: true });
      })
      .catch((e) => {
        logger.error_obj("API: " + "/getAllNewss", {
          message: "API Error: " + e,
          status: false,
        });
        res.send({ message: e, status: false });
      });
  } catch (e) {
    logger.error_obj("API: " + "/getAllNewss", {
      message: "API Failed: " + e,
      status: false,
    });
    res.send({ message: e, status: false });
  }
});

SPNewsRouter.get("/getAllNews", async (_req, res) => {
  try {
    await NewsManager.createQueryBuilder(NewsAnnouncement, "News")
      .select([
        "News.id",
        "News.category_type",
        "News.description",
        "News.code",
      ])
      .addSelect(
        "CASE WHEN News.status = 1 then 'Show' else 'Hide' end",
        "status"
      )
      .where("status = 1")
      .getRawMany()
      .then((data) => {
        logger.info_obj("API: " + "/getAllNews", {
          message: "API Done",
          total: data.length,
          status: true,
        });
        res.send({ data, total: data.length, status: true });
      })
      .catch((e) => {
        logger.error_obj("API: " + "/getAllNews", {
          message: "API Error: " + e,
          status: false,
        });
        res.send({ message: e, status: false });
      });
  } catch (e) {
    logger.error_obj("API: " + "/getAllNews", {
      message: "API Failed: " + e,
      status: false,
    });
    res.send({ message: e, status: false });
  }
});

SPNewsRouter.post("/getOneNews", async (req, res) => {
  const { id } = req.body;

  try {
    await NewsManager.createQueryBuilder(NewsAnnouncement, "News")
      .select([
        "News.id",
        "News.category_type",
        "News.description",
        "News.code",
      ])
      .addSelect(
        "CASE WHEN News.status = 1 then 'Show' else 'Hide' end",
        "status"
      )
      .where(`id = ${id}`)
      .getRawOne()
      .then((data) => {
        logger.info_obj("API: " + "/getOneNews", {
          message: "API Done",
          total: data.length,
          status: true,
        });
        res.send({ data, total: data.length, status: true });
      })
      .catch((e) => {
        logger.error_obj("API: " + "/getOneNews", {
          message: "API Error: " + e,
          status: false,
        });
        res.send({ message: e, status: false });
      });
  } catch (e) {
    logger.error_obj("API: " + "/getOneNews", {
      message: "API Failed: " + e,
      status: false,
    });
    res.send({ message: e, status: false });
  }
});

SPNewsRouter.post("/addNews", async (req, res) => {
  const { values } = req.body;
  try {
    const checkDuplicate = await NewsManager.findOne(NewsAnnouncement, {
      title: values.title,
    });

    if (checkDuplicate !== undefined) {
      logger.error_obj("API: " + "/addNews", {
        message:
          "API Error: " +
          `Redundant on News ${values.category_type} - ${values.description} (${values.code}).`,
        value: values.uom,
        status: false,
      });
      return res.send({
        message: `Redundant on News ${values.category_type} - ${values.description} (${values.code}).`,
        status: false,
      });
    }

    const mainResult = {
      title: values.title,
      content: values.content,
      user_id: values.user_id,
      datetime: Date.now(),
      status: 1,
    };

    await NewsManager.insert(NewsAnnouncement, mainResult)
      .then((data) => {
        logger.info_obj("API: " + "/addNews", {
          message: "API Done",
          value: values,
          status: true,
        });
        res.send({ data, value: values, status: true });
      })
      .catch((e) => {
        logger.error_obj("API: " + "/addNews", {
          message: "API Error: " + e,
          status: false,
        });
        res.send({ message: e, status: false });
      });
  } catch (e) {
    logger.error_obj("API: " + "/addNews", {
      message: "API Failed: " + e,
      status: false,
    });
    res.send({ message: e, status: false });
  }
});

SPNewsRouter.post("/editNews", async (req, res) => {
  const { id, values } = req.body;
  try {
    const checkDuplicate = await NewsManager.findOne(NewsAnnouncement, {
      title: values.title,
    });

    if (checkDuplicate !== undefined) {
      if (checkDuplicate?.id != id) {
        logger.error_obj("API: " + "/editNews", {
          message: "API Error: " + `Redundant on News ${values.title}.`,
          value: values,
          status: false,
        });
        return res.send({
          message: `Redundant on News ${values.title}.`,
          status: false,
        });
      }
    }

    await NewsManager.update(
      NewsAnnouncement,
      { id },
      {
        title: values.title,
        content: values.content,
        user_id: values.user_id,
        status: values.status === "Show" ? 1 : 0,
      }
    )
      .then((data) => {
        logger.info_obj("API: " + "/editNews", {
          message: "API Done",
          value: data,
          status: true,
        });
        res.send({ data, value: data, status: true });
      })
      .catch((e) => {
        logger.error_obj("API: " + "/editNews", {
          message: "API Error: " + e,
          status: false,
        });
        res.send({ message: e, status: false });
      });
  } catch (e) {
    logger.error_obj("API: " + "/editNews", {
      message: "API Failed: " + e,
      status: false,
    });
    res.send({ message: e, status: false });
  }
});

SPNewsRouter.post("/deleteNews", async (req, res) => {
  const { id } = req.body;
  try {
    await NewsManager.update(
      NewsAnnouncement,
      { id },
      {
        status: 0,
      }
    )
      .then((data) => {
        logger.info_obj("API: " + "/deleteNews", {
          message: "API Done",
          value: data,
          status: true,
        });
        res.send({ data, value: data, status: true });
      })
      .catch((e) => {
        logger.error_obj("API: " + "/deleteNews", {
          message: "API Error: " + e,
          status: false,
        });
        res.send({ message: e, status: false });
      });
  } catch (e) {
    logger.error_obj("API: " + "/deleteNews", {
      message: "API Failed: " + e,
      status: false,
    });
    res.send({ message: e, status: false });
  }
});

SPNewsRouter.post("/recoverNews", async (req, res) => {
  const { id } = req.body;
  try {
    await NewsManager.update(
      NewsAnnouncement,
      { id },
      {
        status: 1,
      }
    )
      .then((data) => {
        logger.info_obj("API: " + "/recoverNews", {
          message: "API Done",
          value: data,
          status: true,
        });
        res.send({ data, value: data, status: true });
      })
      .catch((e) => {
        logger.error_obj("API: " + "/recoverNews", {
          message: "API Error: " + e,
          status: false,
        });
        res.send({ message: e, status: false });
      });
  } catch (e) {
    logger.error_obj("API: " + "/recoverNews", {
      message: "API Failed: " + e,
      status: false,
    });
    res.send({ message: e, status: false });
  }
});

module.exports = SPNewsRouter;
