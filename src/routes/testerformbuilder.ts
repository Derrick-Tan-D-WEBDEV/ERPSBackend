import { Router } from "express";
import { getManager } from "typeorm";

import { LoggerService } from "../LoggerService";
import { TesterFormBuilder } from "../entity/TesterFormBuilder";

const logger = new LoggerService("tester-form-builder-api");
const TesterFormBuilderRouter = Router();
const TesterFormBuilderManager = getManager("standardPartsDB");

TesterFormBuilderRouter.get("/", async (_req, res) => {
  res.send("Connect To Tester Form Builder Successfully.");
});

TesterFormBuilderRouter.get("/getAllTesterFormBuilder", async (_req, res) => {
  try {
    await TesterFormBuilderManager.createQueryBuilder(
      TesterFormBuilder,
      "TesterFormBuilder"
    )
      .select([
        "TesterFormBuilder.id",
        "TesterFormBuilder.title",
        "TesterFormBuilder.description",
        "TesterFormBuilder.formStructure",
      ])
      .getRawMany()
      .then((data) => {
        logger.info_obj("API: " + "/getAllTesterFormBuilder", {
          message: "API Done",
          total: data.length,
          status: true,
        });
        res.send({ data, total: data.length, status: true });
      })
      .catch((e) => {
        logger.error_obj("API: " + "/getAllTesterFormBuilder", {
          message: "API Error: " + e,
          status: false,
        });
        res.send({ message: e, status: false });
      });
  } catch (e) {
    logger.error_obj("API: " + "/getAllTesterFormBuilder", {
      message: "API Failed: " + e,
      status: false,
    });
    res.send({ message: e, status: false });
  }
});

TesterFormBuilderRouter.post("/getOneTesterFormBuilder", async (req, res) => {
  const { id } = req.body;

  try {
    await TesterFormBuilderManager.createQueryBuilder(
      TesterFormBuilder,
      "TesterFormBuilder"
    )
      .select([
        "TesterFormBuilder.id",
        "TesterFormBuilder.title",
        "TesterFormBuilder.description",
        "TesterFormBuilder.formStructure",
      ])
      .where(`id = ${id}`)
      .getRawOne()
      .then((data) => {
        logger.info_obj("API: " + "/getOneTesterFormBuilder", {
          message: "API Done",
          total: data.length,
          status: true,
        });
        res.send({ data, total: data.length, status: true });
      })
      .catch((e) => {
        logger.error_obj("API: " + "/getOneTesterFormBuilder", {
          message: "API Error: " + e,
          status: false,
        });
        res.send({ message: e, status: false });
      });
  } catch (e) {
    logger.error_obj("API: " + "/getOneTesterFormBuilder", {
      message: "API Failed: " + e,
      status: false,
    });
    res.send({ message: e, status: false });
  }
});

TesterFormBuilderRouter.post("/createTesterFormBuilder", async (req, res) => {
  const { values } = req.body;
  try {
    const checkDuplicate = await TesterFormBuilderManager.findOne(
      TesterFormBuilder,
      {
        title: values.title,
      }
    );

    if (checkDuplicate !== undefined) {
      logger.error_obj("API: " + "/createTesterFormBuilder", {
        message: "API Error: " + `Redundant on Type Item ${values.type_item}.`,
        value: values,
        status: false,
      });
      return res.send({
        message: `Redundant on Type Item ${values.type_item}.`,
        status: false,
      });
    }

    await TesterFormBuilderManager.insert(TesterFormBuilder, values)
      .then((data) => {
        logger.info_obj("API: " + "/createTesterFormBuilder", {
          message: "API Done",
          value: values,
          status: true,
        });
        res.send({ data, value: values, status: true });
      })
      .catch((e) => {
        logger.error_obj("API: " + "/createTesterFormBuilder", {
          message: "API Error: " + e,
          status: false,
        });
        res.send({ message: e, status: false });
      });
  } catch (e) {
    logger.error_obj("API: " + "/createTesterFormBuilder", {
      message: "API Failed: " + e,
      status: false,
    });
    res.send({ message: e, status: false });
  }
});

module.exports = TesterFormBuilderRouter;
