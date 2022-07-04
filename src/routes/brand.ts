import { Router } from "express";
import { getManager } from "typeorm";
import { LoggerService } from "../LoggerService";
import { SP_Brand } from "../entity/SP_Brand";

const logger = new LoggerService("brand-api");
const SPBrandRouter = Router();
const Brandanager = getManager("standardPartsDB");

SPBrandRouter.get("/", async (_req, res) => {
  res.send("Connect to Brand Successfully.");
});

SPBrandRouter.get("/getAllBrands", async (_req, res) => {
  try {
    await Brandanager.createQueryBuilder(SP_Brand, "sp_brand")
      .select(["sp_brand.id", "sp_brand.brand_name"])
      .addSelect(
        "CASE WHEN sp_brand.status = 1 then 'Show' else 'Hide' end",
        "status"
      )
      .getRawMany()
      .then((data) => {
        logger.info_obj("API: " + "/getAllBrands", {
          message: "API Done",
          total: data.length,
          status: true,
        });
        res.send({ data, total: data.length, status: true });
      })
      .catch((e) => {
        logger.error_obj("API: " + "/getAllBrands", {
          message: "API Error: " + e,
          status: false,
        });
        res.send({ message: e, status: false });
      });
  } catch (e) {
    logger.error_obj("API: " + "/getAllBrands", {
      message: "API Failed: " + e,
      status: false,
    });
    res.send({ message: e, status: false });
  }
});

SPBrandRouter.get("/getAllBrand", async (_req, res) => {
  try {
    await Brandanager.createQueryBuilder(SP_Brand, "sp_brand")
      .select(["sp_brand.id", "sp_brand.brand_name", "sp_brand.status"])
      .addSelect(
        "CASE WHEN sp_brand.status = 1 then 'Show' else 'Hide' end",
        "status"
      )
      .where("status = 1")
      .getRawMany()
      .then((data) => {
        logger.info_obj("API: " + "/getAllBrand", {
          message: "API Done",
          total: data.length,
          status: true,
        });
        res.send({ data, total: data.length, status: true });
      })
      .catch((e) => {
        logger.error_obj("API: " + "/getAllBrand", {
          message: "API Error: " + e,
          status: false,
        });
        res.send({ message: e, status: false });
      });
  } catch (e) {
    logger.error_obj("API: " + "/getAllBrand", {
      message: "API Failed: " + e,
      status: false,
    });
    res.send({ message: e, status: false });
  }
});

SPBrandRouter.post("/getOneBrand", async (req, res) => {
  const { id } = req.body;

  try {
    await Brandanager.createQueryBuilder(SP_Brand, "sp_brand")
      .select(["sp_brand.id", "sp_brand.brand_name", "sp_brand.status"])
      .addSelect(
        "CASE WHEN sp_brand.status = 1 then 'Show' else 'Hide' end",
        "status"
      )
      .where(`id = ${id} `)
      .getRawOne()
      .then((data) => {
        logger.info_obj("API: " + "/getOneBrand", {
          message: "API Done",
          total: data.length,
          status: true,
        });
        res.send({ data, total: data.length, status: true });
      })
      .catch((e) => {
        logger.error_obj("API: " + "/getOneBrand", {
          message: "API Error: " + e,
          status: false,
        });
        res.send({ message: e, status: false });
      });
  } catch (e) {
    logger.error_obj("API: " + "/getOneBrand", {
      message: "API Failed: " + e,
      status: false,
    });
    res.send({ message: e, status: false });
  }
});

SPBrandRouter.post("/addBrand", async (req, res) => {
  const { values } = req.body;
  try {
    const checkDuplicate = await Brandanager.findOne(SP_Brand, {
      brand_name: values.brand,
    });

    if (checkDuplicate !== undefined) {
      logger.error_obj("API: " + "/addBrand", {
        message: "API Error: " + `Redundant on Brand name ${values.brand}.`,
        value: values.brand,
        status: false,
      });
      return res.send({
        message: `Redundant Brand name ${values.brand}.`,
        status: false,
      });
    }

    const mainResult = {
      brand_name: values.brand,
      status: 1,
    };

    await Brandanager.insert(SP_Brand, mainResult)
      .then((data) => {
        logger.info_obj("API: " + "/addBrand", {
          message: "API Done",
          value: values.brand,
          status: true,
        });
        res.send({ data, value: values.brand, status: true });
      })
      .catch((e) => {
        logger.error_obj("API: " + "/addBrand", {
          message: "API Error: " + e,
          status: false,
        });
        res.send({ message: e, status: false });
      });
  } catch (e) {
    logger.error_obj("API: " + "/addBrand", {
      message: "API Failed: " + e,
      status: false,
    });
    res.send({ message: e, status: false });
  }
});

SPBrandRouter.post("/editBrand", async (req, res) => {
  const { id, values } = req.body;
  try {
    const checkDuplicate = await Brandanager.findOne(SP_Brand, {
      brand_name: values.brand,
    });

    if (checkDuplicate !== undefined) {
      if (checkDuplicate?.id != id) {
        logger.error_obj("API: " + "/editBrand", {
          message: "API Error: " + `Redundant on Brand Name ${values.brand}.`,
          value: values.brand,
          status: false,
        });
        return res.send({
          message: `Redundant on Brand UOM ${values.brand}.`,
          status: false,
        });
      }
    }

    await Brandanager.update(
      SP_Brand,
      { id },
      {
        brand_name: values.brand,
        status: values.status === "Show" ? 1 : 0,
      }
    )
      .then((data) => {
        logger.info_obj("API: " + "/editBrand", {
          message: "API Done",
          value: data,
          status: true,
        });
        res.send({ data, value: data, status: true });
      })
      .catch((e) => {
        logger.error_obj("API: " + "/editBrand", {
          message: "API Error: " + e,
          status: false,
        });
        res.send({ message: e, status: false });
      });
  } catch (e) {
    logger.error_obj("API: " + "/editBrand", {
      message: "API Failed: " + e,
      status: false,
    });
    res.send({ message: e, status: false });
  }
});

SPBrandRouter.post("/deleteBrand", async (req, res) => {
  const { id } = req.body;
  try {
    await Brandanager.update(
      SP_Brand,
      { id },
      {
        status: 0,
      }
    )
      .then((data) => {
        logger.info_obj("API: " + "/deleteBrand", {
          message: "API Done",
          value: data,
          status: true,
        });
        res.send({ data, value: data, status: true });
      })
      .catch((e) => {
        logger.error_obj("API: " + "/deleteBrand", {
          message: "API Error: " + e,
          status: false,
        });
        res.send({ message: e, status: false });
      });
  } catch (e) {
    logger.error_obj("API: " + "/deleteBrand", {
      message: "API Failed: " + e,
      status: false,
    });
    res.send({ message: e, status: false });
  }
});

SPBrandRouter.post("/recoverBrand", async (req, res) => {
  const { id } = req.body;
  try {
    await Brandanager.update(
      SP_Brand,
      { id },
      {
        status: 1,
      }
    )
      .then((data) => {
        logger.info_obj("API: " + "/recoverBrand", {
          message: "API Done",
          value: data,
          status: true,
        });
        res.send({ data, value: data, status: true });
      })
      .catch((e) => {
        logger.error_obj("API: " + "/recoverBrand", {
          message: "API Error: " + e,
          status: false,
        });
        res.send({ message: e, status: false });
      });
  } catch (e) {
    logger.error_obj("API: " + "/recoverBrand", {
      message: "API Failed: " + e,
      status: false,
    });
    res.send({ message: e, status: false });
  }
});

module.exports = SPBrandRouter;
