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
import axios from "axios";

const logger = new LoggerService("users-api");
const UserRouter = Router();
const UserManager = getManager("standardPartsDB");

UserRouter.get("/", async (_req, res) => {
  res.send({ message: "Users Connected", status: true });
});

UserRouter.get("/getAllTypeUsers", async (_req, res) => {
  try {
    await UserManager.createQueryBuilder(User, "user")
      .select([
        "user.id AS id",
        "user.employeeID AS employeeID",
        "user.fullname AS fullname",
        "user.name AS name",
        "user.email AS email",
        "user.section AS section",
      ])
      .addSelect(
        "CASE WHEN user.status = 1 then 'Show' else 'Hide' end",
        "status"
      )
      .where("user.employeeID != 0 ")
      .getRawMany()
      .then((data) => {
        logger.info_obj("API: " + "/getAllTypeUsers", {
          message: "API Done",
          total: data.length,
          status: true,
        });
        res.send({ data, total: data.length, status: true });
      })
      .catch((e) => {
        logger.error_obj("API: " + "/getAllTypeUsers", {
          message: "API Error: " + e,
          status: false,
        });
        res.send({ message: e, status: false });
      });
  } catch (e) {
    logger.error_obj("API: " + "/getAllTypeUsers", {
      message: "API Failed: " + e,
      status: false,
    });
    res.send({ message: e, status: false });
  }
});

UserRouter.get("/getAllTypeUser", async (_req, res) => {
  try {
    await UserManager.createQueryBuilder(User, "user")
      .select([
        "user.id AS id",
        "user.employeeID AS employeeID",
        "user.fullname AS fullname",
        "user.name AS name",
        "user.email AS email",
        "user.section AS section",
      ])
      .addSelect(
        "CASE WHEN user.status = 1 then 'Show' else 'Hide' end",
        "status"
      )
      .where("user.status = 1  AND user.employeeID != 0 ")
      .getRawMany()
      .then((data) => {
        logger.info_obj("API: " + "/getAllTypeUser", {
          message: "API Done",
          total: data.length,
          status: true,
        });
        res.send({ data, total: data.length, status: true });
      })
      .catch((e) => {
        logger.error_obj("API: " + "/getAllTypeUser", {
          message: "API Error: " + e,
          status: false,
        });
        res.send({ message: e, status: false });
      });
  } catch (e) {
    logger.error_obj("API: " + "/getAllTypeUser", {
      message: "API Failed: " + e,
      status: false,
    });
    res.send({ message: e, status: false });
  }
});

UserRouter.get("/getAllUsers", async (_req, res) => {
  try {
    await UserManager.createQueryBuilder(User, "user")
      .select([
        "user.id AS id",
        "user.employeeID AS employeeID",
        "user.fullname AS fullname",
        "user.name AS name",
        "user.email AS email",
        "user.section AS section",
      ])
      .addSelect(
        "CASE WHEN user.status = 1 then 'Show' else 'Hide' end",
        "status"
      )
      .andWhere('user.role = "User" AND user.employeeID != 0 ')
      .getRawMany()
      .then((data) => {
        logger.info_obj("API: " + "/getAllUsers", {
          message: "API Done",
          total: data.length,
          status: true,
        });
        res.send({ data, total: data.length, status: true });
      })
      .catch((e) => {
        logger.error_obj("API: " + "/getAllUsers", {
          message: "API Error: " + e,
          status: false,
        });
        res.send({ message: e, status: false });
      });
  } catch (e) {
    logger.error_obj("API: " + "/getAllUsers", {
      message: "API Failed: " + e,
      status: false,
    });
    res.send({ message: e, status: false });
  }
});

UserRouter.get("/getAllUser", async (_req, res) => {
  try {
    await UserManager.createQueryBuilder(User, "user")
      .select([
        "user.id AS id",
        "user.employeeID AS employeeID",
        "user.fullname AS fullname",
        "user.name AS name",
        "user.email AS email",
        "user.section AS section",
      ])
      .addSelect(
        "CASE WHEN user.status = 1 then 'Show' else 'Hide' end",
        "status"
      )
      .where("user.status = 1  AND user.employeeID != 0 ")
      .andWhere('user.role = "User"')
      .getRawMany()
      .then((data) => {
        logger.info_obj("API: " + "/getAllUser", {
          message: "API Done",
          total: data.length,
          status: true,
        });
        res.send({ data, total: data.length, status: true });
      })
      .catch((e) => {
        logger.error_obj("API: " + "/getAllUser", {
          message: "API Error: " + e,
          status: false,
        });
        res.send({ message: e, status: false });
      });
  } catch (e) {
    logger.error_obj("API: " + "/getAllUser", {
      message: "API Failed: " + e,
      status: false,
    });
    res.send({ message: e, status: false });
  }
});

UserRouter.get("/getAllViewers", async (_req, res) => {
  try {
    await UserManager.createQueryBuilder(User, "user")
      .select([
        "user.id AS id",
        "user.employeeID AS employeeID",
        "user.fullname AS fullname",
        "user.name AS name",
        "user.email AS email",
        "user.section AS section",
      ])
      .addSelect(
        "CASE WHEN user.status = 1 then 'Show' else 'Hide' end",
        "status"
      )
      .andWhere('user.role = "Viewer"')
      .getRawMany()
      .then((data) => {
        logger.info_obj("API: " + "/getAllViewers", {
          message: "API Done",
          total: data.length,
          status: true,
        });
        res.send({ data, total: data.length, status: true });
      })
      .catch((e) => {
        logger.error_obj("API: " + "/getAllViewers", {
          message: "API Error: " + e,
          status: false,
        });
        res.send({ message: e, status: false });
      });
  } catch (e) {
    logger.error_obj("API: " + "/getAllViewers", {
      message: "API Failed: " + e,
      status: false,
    });
    res.send({ message: e, status: false });
  }
});

UserRouter.get("/getAllViewer", async (_req, res) => {
  try {
    await UserManager.createQueryBuilder(User, "user")
      .select([
        "user.id AS id",
        "user.employeeID AS employeeID",
        "user.fullname AS fullname",
        "user.name AS name",
        "user.email AS email",
        "user.section AS section",
      ])
      .addSelect(
        "CASE WHEN user.status = 1 then 'Show' else 'Hide' end",
        "status"
      )
      .where("user.status = 1")
      .andWhere('user.role = "Viewer"')
      .getRawMany()
      .then((data) => {
        logger.info_obj("API: " + "/getAllViewer", {
          message: "API Done",
          total: data.length,
          status: true,
        });
        res.send({ data, total: data.length, status: true });
      })
      .catch((e) => {
        logger.error_obj("API: " + "/getAllViewer", {
          message: "API Error: " + e,
          status: false,
        });
        res.send({ message: e, status: false });
      });
  } catch (e) {
    logger.error_obj("API: " + "/getAllViewer", {
      message: "API Failed: " + e,
      status: false,
    });
    res.send({ message: e, status: false });
  }
});

UserRouter.get("/getAllDevelopers", async (_req, res) => {
  try {
    await UserManager.createQueryBuilder(User, "user")
      .select([
        "user.id AS id",
        "user.employeeID AS employeeID",
        "user.fullname AS fullname",
        "user.name AS name",
        "user.email AS email",
        "user.section AS section",
      ])
      .addSelect(
        "CASE WHEN user.status = 1 then 'Show' else 'Hide' end",
        "status"
      )
      .andWhere('user.role = "Developer"')
      .getRawMany()
      .then((data) => {
        logger.info_obj("API: " + "/getAllDevelopers", {
          message: "API Done",
          total: data.length,
          status: true,
        });
        res.send({ data, total: data.length, status: true });
      })
      .catch((e) => {
        logger.error_obj("API: " + "/getAllDevelopers", {
          message: "API Error: " + e,
          status: false,
        });
        res.send({ message: e, status: false });
      });
  } catch (e) {
    logger.error_obj("API: " + "/getAllDevelopers", {
      message: "API Failed: " + e,
      status: false,
    });
    res.send({ message: e, status: false });
  }
});

UserRouter.get("/getAllDeveloper", async (_req, res) => {
  try {
    await UserManager.createQueryBuilder(User, "user")
      .select([
        "user.id AS id",
        "user.employeeID AS employeeID",
        "user.fullname AS fullname",
        "user.name AS name",
        "user.email AS email",
        "user.section AS section",
      ])
      .addSelect(
        "CASE WHEN user.status = 1 then 'Show' else 'Hide' end",
        "status"
      )
      .where("user.status = 1")
      .andWhere('user.role = "Developer"')
      .getRawMany()
      .then((data) => {
        logger.info_obj("API: " + "/getAllDeveloper", {
          message: "API Done",
          total: data.length,
          status: true,
        });
        res.send({ data, total: data.length, status: true });
      })
      .catch((e) => {
        logger.error_obj("API: " + "/getAllDeveloper", {
          message: "API Error: " + e,
          status: false,
        });
        res.send({ message: e, status: false });
      });
  } catch (e) {
    logger.error_obj("API: " + "/getAllDeveloper", {
      message: "API Failed: " + e,
      status: false,
    });
    res.send({ message: e, status: false });
  }
});

UserRouter.get("/getAllAdmins", async (_req, res) => {
  try {
    await UserManager.createQueryBuilder(User, "user")
      .select([
        "user.id AS id",
        "user.employeeID AS employeeID",
        "user.fullname AS fullname",
        "user.name AS name",
        "user.email AS email",
        "user.section AS section",
      ])
      .addSelect(
        "CASE WHEN user.status = 1 then 'Show' else 'Hide' end",
        "status"
      )
      .andWhere('user.role = "Admin"')
      .getRawMany()
      .then((data) => {
        logger.info_obj("API: " + "/getAllAdmins", {
          message: "API Done",
          total: data.length,
          status: true,
        });
        res.send({ data, total: data.length, status: true });
      })
      .catch((e) => {
        logger.error_obj("API: " + "/getAllAdmins", {
          message: "API Error: " + e,
          status: false,
        });
        res.send({ message: e, status: false });
      });
  } catch (e) {
    logger.error_obj("API: " + "/getAllAdmins", {
      message: "API Failed: " + e,
      status: false,
    });
    res.send({ message: e, status: false });
  }
});

UserRouter.get("/getAllAdmin", async (_req, res) => {
  try {
    await UserManager.createQueryBuilder(User, "user")
      .select([
        "user.id AS id",
        "user.employeeID AS employeeID",
        "user.fullname AS fullname",
        "user.name AS name",
        "user.email AS email",
        "user.section AS section",
      ])
      .addSelect(
        "CASE WHEN user.status = 1 then 'Show' else 'Hide' end",
        "status"
      )
      .where("user.status = 1")
      .andWhere('user.role = "Admin"')
      .getRawMany()
      .then((data) => {
        logger.info_obj("API: " + "/getAllAdmin", {
          message: "API Done",
          total: data.length,
          status: true,
        });
        res.send({ data, total: data.length, status: true });
      })
      .catch((e) => {
        logger.error_obj("API: " + "/getAllAdmin", {
          message: "API Error: " + e,
          status: false,
        });
        res.send({ message: e, status: false });
      });
  } catch (e) {
    logger.error_obj("API: " + "/getAllAdmin", {
      message: "API Failed: " + e,
      status: false,
    });
    res.send({ message: e, status: false });
  }
});

UserRouter.get("/getAllSuperAdmins", async (_req, res) => {
  try {
    await UserManager.createQueryBuilder(User, "user")
      .select([
        "user.id AS id",
        "user.employeeID AS employeeID",
        "user.fullname AS fullname",
        "user.name AS name",
        "user.email AS email",
        "user.section AS section",
      ])
      .addSelect(
        "CASE WHEN user.status = 1 then 'Show' else 'Hide' end",
        "status"
      )
      .andWhere('user.role = "SuperAdmin"')
      .getRawMany()
      .then((data) => {
        logger.info_obj("API: " + "/getAllSuperAdmins", {
          message: "API Done",
          total: data.length,
          status: true,
        });
        res.send({ data, total: data.length, status: true });
      })
      .catch((e) => {
        logger.error_obj("API: " + "/getAllSuperAdmins", {
          message: "API Error: " + e,
          status: false,
        });
        res.send({ message: e, status: false });
      });
  } catch (e) {
    logger.error_obj("API: " + "/getAllSuperAdmins", {
      message: "API Failed: " + e,
      status: false,
    });
    res.send({ message: e, status: false });
  }
});

UserRouter.get("/getAllSuperAdmin", async (_req, res) => {
  try {
    await UserManager.createQueryBuilder(User, "user")
      .select([
        "user.id AS id",
        "user.employeeID AS employeeID",
        "user.fullname AS fullname",
        "user.name AS name",
        "user.email AS email",
        "user.section AS section",
      ])
      .addSelect(
        "CASE WHEN user.status = 1 then 'Show' else 'Hide' end",
        "status"
      )
      .where("user.status = 1")
      .andWhere('user.role = "SuperAdmin"')
      .getRawMany()
      .then((data) => {
        logger.info_obj("API: " + "/getAllSuperAdmin", {
          message: "API Done",
          total: data.length,
          status: true,
        });
        res.send({ data, total: data.length, status: true });
      })
      .catch((e) => {
        logger.error_obj("API: " + "/getAllSuperAdmin", {
          message: "API Error: " + e,
          status: false,
        });
        res.send({ message: e, status: false });
      });
  } catch (e) {
    logger.error_obj("API: " + "/getAllSuperAdmin", {
      message: "API Failed: " + e,
      status: false,
    });
    res.send({ message: e, status: false });
  }
});

UserRouter.get("/getUserAdminSuperAdmin", async (_req, res) => {
  try {
    await UserManager.createQueryBuilder(User, "user")
      .select([
        "user.id AS id",
        "user.employeeID AS employeeID",
        "user.fullname AS fullname",
        "user.name AS name",
        "user.email AS email",
        "user.section AS section",
      ])
      .addSelect(
        "CASE WHEN user.status = 1 then 'Show' else 'Hide' end",
        "status"
      )
      .where("user.status = 1")
      .andWhere(
        'user.role = "SuperAdmin" OR user.role = "Admin" OR user.role = "User" OR user.role = "Developer"'
      )
      .getRawMany()
      .then((data) => {
        logger.info_obj("API: " + "/getUserAdminSuperAdmin", {
          message: "API Done",
          total: data.length,
          status: true,
        });
        res.send({ data, total: data.length, status: true });
      })
      .catch((e) => {
        logger.error_obj("API: " + "/getUserAdminSuperAdmin", {
          message: "API Error: " + e,
          status: false,
        });
        res.send({ message: e, status: false });
      });
  } catch (e) {
    logger.error_obj("API: " + "/getUserAdminSuperAdmin", {
      message: "API Failed: " + e,
      status: false,
    });
    res.send({ message: e, status: false });
  }
});

UserRouter.post("/getOneUser", async (req, res) => {
  const { id } = req.body;
  try {
    await UserManager.createQueryBuilder(User, "user")
      .select([
        "user.id AS id",
        "user.employeeID AS employeeID",
        "user.fullname AS fullname",
        "user.name AS name",
        "user.email AS email",
        "user.section AS section",
      ])
      .addSelect(
        "CASE WHEN user.status = 1 then 'Show' else 'Hide' end",
        "status"
      )
      .where(`user.id = "${id}"`)
      .getRawOne()
      .then((data) => {
        logger.info_obj("API: " + "/getOneUser", {
          message: "API Done",
          total: 1,
          value: id,
          status: true,
        });
        console.log(id);
        res.send({ data, total: 1, status: true });
      })
      .catch((e) => {
        logger.error_obj("API: " + "/getOneUser", {
          message: "API Error: " + e,
          value: id,
          status: false,
        });
        res.send({ message: e, status: false });
      });
  } catch (e) {
    logger.error_obj("API: " + "/getOneUser", {
      message: "API Failed: " + e,
      value: id,
      status: false,
    });
    res.send({ message: e, status: false });
  }
});

UserRouter.post("/getBySection", async (req, res) => {
  const { sect } = req.body;
  try {
    await UserManager.createQueryBuilder(User, "user")
      .select([
        "user.id AS id",
        "user.employeeID AS employeeID",
        "user.fullname AS fullname",
        "user.name AS name",
        "user.email AS email",
        "user.section AS section",
      ])
      .where("user.status = 1")
      .andWhere(`user.section = "${sect}"`)
      .getRawMany()
      .then((data) => {
        logger.info_obj("API: " + "/getBySection", {
          message: "API Done",
          total: data.length,
          value: sect,
          status: true,
        });
        res.send({ data, total: data.length, status: true });
      })
      .catch((e) => {
        logger.error_obj("API: " + "/getBySection", {
          message: "API Error: " + e,
          value: sect,
          status: false,
        });
        res.send({ message: e, status: false });
      });
  } catch (e) {
    logger.error_obj("API: " + "/getBySection", {
      message: "API Failed: " + e,
      value: sect,
      status: false,
    });
    res.send({ message: e, status: false });
  }
});

UserRouter.post("/getByEmpId", async (req, res) => {
  const { emp_id } = req.body;
  try {
    await UserManager.createQueryBuilder(User, "user")
      .select([
        "user.id AS id",
        "user.employeeID AS employeeID",
        "user.fullname AS fullname",
        "user.name AS name",
        "user.email AS email",
        "user.section AS section",
      ])
      .where("user.status = 1")
      .andWhere(`user.employeeID = "${emp_id}"`)
      .getRawMany()
      .then((data) => {
        logger.info_obj("API: " + "/getByEmpId", {
          message: "API Done",
          total: data.length,
          value: emp_id,
          status: true,
        });
        res.send({ data, total: data.length, status: true });
      })
      .catch((e) => {
        logger.error_obj("API: " + "/getByEmpId", {
          message: "API Error: " + e,
          value: emp_id,
          status: false,
        });
        res.send({ message: e, status: false });
      });
  } catch (e) {
    logger.error_obj("API: " + "/getByEmpId", {
      message: "API Failed: " + e,
      value: emp_id,
      status: false,
    });
    res.send({ message: e, status: false });
  }
});

// Create
UserRouter.post("/createUser", async (req, res) => {
  const { values } = req.body;
  try {
    const { employeeID, fullname, name, email, section, role } = values;

    const password = await argon2.hash("123");
    const checkExist = await UserManager.findOne(User, {
      where: [{ email }, { employeeID }],
    });

    if (checkExist !== undefined) {
      logger.error_obj("API: " + "/createUser", {
        message:
          "API Error: " +
          `Redundant on Employee ID/Email ${values.employeeID} ${values.email}.`,
        value: values,
        status: false,
      });
      return res.send({
        message: `Redundant on Employee ID/Email ${values.employeeID} ${values.email}.`,
        status: false,
      });
    }

    const mainResult = {
      employeeID,
      fullname,
      name,
      email,
      section,
      role,
      status: 1,
      password,
    };

    await UserManager.insert(User, mainResult)
      .then((data) => {
        logger.info_obj("API: " + "/createUser", {
          message: "API Done",
          main: { employeeID },
          status: true,
        });
        res.send({
          data: `Insert Successfully`,
          main: { employeeID },
          status: true,
        });
      })
      .catch((e) => {
        logger.error_obj("API: " + "/createUser", {
          message: "API Error" + e,
          value: values,
          status: false,
        });
        res.send({ data: `Error On Insert To DB: ` + e, status: false });
      });

      // const usr = await UserManager.findOne(User, { name : name })

      // const user_id = usr?.id
      
      // const mainIcon = {
      //   accessory : "shades",
      //   body: "breasts",
      //   circleColor: "blue",
      //   clothing: "tankTop",
      //   clothingColor: "black",
      //   eyebrows: "angry",
      //   eyes: "wink",
      //   facialHair: "mediumBeard",
      //   graphic: "vue",
      //   hair: "beanie",
      //   hairColor: "black",
      //   hat: "green",
      //   hatColor: "green",
      //   lashes: "false",
      //   lipColor: "purple",
      //   mask: "true",
      //   faceMask: "true",
      //   mouth: "open",
      //   skinTone: "brown",
      //   faceMaskColor: "blue",
      //   user_id,
      //   status : 1
      // }

      // const resp = await axios({
      //   method : "post",
      //   url : "http://192.168.0.24:4000/UserIcon/addUserIcon",
      //   data : mainIcon
      // })
  } catch (e) {
    logger.error_obj("API: " + "/createUser", {
      message: "API Failed: " + e,
      value: values,
      status: false,
    });
    res.send({ message: e, status: false });
  }
});

// Edit
UserRouter.post("/changeRole", async (req, res) => {
  const { id, role } = req.body;
  try {
    await UserManager.update(
      User,
      { id },
      {
        role,
      }
    )
      .then((data) => {
        logger.info_obj("API: " + "/changeRole", {
          message: "API Done",
          main: data,
          status: true,
        });
        res.send({ data: `Insert Successfully`, main: data, status: true });
      })
      .catch((e) => {
        logger.error_obj("API: " + "/changeRole", {
          message: "API Error" + e,
          value: { id, role },
          status: false,
        });
        res.send({ data: `Error On Insert To DB: ` + e, status: false });
      });
  } catch (e) {
    logger.error_obj("API: " + "/changeRole", {
      message: "API Failed: " + e,
      value: { id, role },
      status: false,
    });
    res.send({ message: e, status: false });
  }
});

UserRouter.post("/editUsers", async (req, res) => {
  const { id, values } = req.body;

  const { fullname, name, email, employeeID, status, section } = values;
  try {
    const user = await UserManager.findOne(User, { id });

    const checkExist = await UserManager.findOne(User, {
      where: [{ email }, { employeeID }],
    });
    console.log(checkExist);
    if (checkExist !== undefined) {
      if (checkExist?.id != id) {
        logger.error_obj("API: " + "/editUsers", {
          message:
            "API Error: " +
            `Redundant on Employee ID/Email ${values.employeeID} ${values.email}.`,
          value: values,
          status: false,
        });
        return res.send({
          message: `Redundant on Employee ID/Email ${values.employeeID} ${values.email}.`,
          status: false,
        });
      }
    }

    if (user === undefined) {
      logger.error_obj("API: " + "/editUsers", {
        message: "API Error: Id Not Found",
        value: { id },
        status: false,
      });
    }

    await UserManager.update(
      User,
      { id },
      {
        fullname,
        name,
        email,
        employeeID,
        section,
        status: status === "Show" ? 1 : 0,
      }
    )
      .then((data) => {
        logger.info_obj("API: " + "/editUsers", {
          message: "API Done",
          main: data,
          status: true,
        });
        res.send({ data: `Edit Successfully`, main: data, status: true });
      })
      .catch((e) => {
        logger.error_obj("API: " + "/editUsers", {
          message: "API Error" + e,
          value: { id, fullname, name, email, employeeID, status, section },
          status: false,
        });
        res.send({ data: `Error On Edit To DB: ` + e, status: false });
      });
  } catch (e) {
    logger.error_obj("API: " + "/editUsers", {
      message: "API Failed: " + e,
      value: { id, fullname, name, email, employeeID, status, section },
      status: false,
    });
    res.send({ message: e, status: false });
  }
});

UserRouter.post("/editUserProfile", async (req, res) => {
  const { id, values } = req.body;

  const { fullname, name, email, employeeID } = values;
  try {
    const user = await UserManager.findOne(User, { id });

    const checkExist = await UserManager.findOne(User, {
      where: [{ email }, { employeeID }],
    });

    if (checkExist !== undefined) {
      if (checkExist?.id != id) {
        logger.error_obj("API: " + "/editUsers", {
          message:
            "API Error: " +
            `Redundant on Employee ID/Email ${values.employeeID} ${values.email}.`,
          value: values,
          status: false,
        });
        return res.send({
          message: `Redundant on Employee ID/Email ${values.employeeID} ${values.email}.`,
          status: false,
        });
      }
    }

    if (user === undefined) {
      logger.error_obj("API: " + "/editUsersProfile", {
        message: "API Error: Id Not Found",
        value: { id },
        status: false,
      });
    }

    await UserManager.update(
      User,
      { id },
      {
        fullname,
        name,
        email,
        employeeID,
      }
    )
      .then((data) => {
        logger.info_obj("API: " + "/editUsersProfile", {
          message: "API Done",
          main: data,
          status: true,
        });
        res.send({ data: `Edit Successfully`, main: data, status: true });
      })
      .catch((e) => {
        logger.error_obj("API: " + "/editUsersProfile", {
          message: "API Error" + e,
          value: { id, fullname, name, email, employeeID },
          status: false,
        });
        res.send({ data: `Error On Edit To DB: ` + e, status: false });
      });
  } catch (e) {
    logger.error_obj("API: " + "/editUsersProfile", {
      message: "API Failed: " + e,
      value: { id, fullname, name, email, employeeID },
      status: false,
    });
    res.send({ message: e, status: false });
  }
});

// Delete
UserRouter.post("/deleteUsers", async (req, res) => {
  const { id } = req.body;
  try {
    const user = await UserManager.findOne(User, { id });

    if (user === undefined) {
      logger.error_obj("API: " + "/deleteUsers", {
        message: "API Error: Id Not Found",
        value: { id },
        status: false,
      });
    }

    await UserManager.update(
      User,
      { id },
      {
        status: 0,
      }
    )
      .then((data) => {
        logger.info_obj("API: " + "/deleteUsers", {
          message: "API Done",
          main: data,
          status: true,
        });
        res.send({ data: `Delete Successfully`, main: data, status: true });
      })
      .catch((e) => {
        logger.error_obj("API: " + "/deleteUsers", {
          message: "API Error" + e,
          value: { id },
          status: false,
        });
        res.send({ data: `Error On Delete To DB: ` + e, status: false });
      });
  } catch (e) {
    logger.error_obj("API: " + "/deleteUsers", {
      message: "API Failed: " + e,
      value: { id },
      status: false,
    });
    res.send({ message: e, status: false });
  }
});

UserRouter.post("/recoverUsers", async (req, res) => {
  const { id } = req.body;
  try {
    const user = await UserManager.findOne(User, { id });

    if (user === undefined) {
      logger.error_obj("API: " + "/recoverUsers", {
        message: "API Error: Id Not Found",
        value: { id },
        status: false,
      });
    }

    await UserManager.update(
      User,
      { id },
      {
        status: 1,
      }
    )
      .then((data) => {
        logger.info_obj("API: " + "/recoverUsers", {
          message: "API Done",
          main: data,
          status: true,
        });
        res.send({ data: `Recover Successfully`, main: data, status: true });
      })
      .catch((e) => {
        logger.error_obj("API: " + "/recoverUsers", {
          message: "API Error" + e,
          value: { id },
          status: false,
        });
        res.send({ data: `Error On Recover To DB: ` + e, status: false });
      });
  } catch (e) {
    logger.error_obj("API: " + "/recoverUsers", {
      message: "API Failed: " + e,
      value: { id },
      status: false,
    });
    res.send({ message: e, status: false });
  }
});

// Login Function
UserRouter.post("/loginUser", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserManager.findOne(User, { email, status: 1 });

    if (user === undefined) {
      logger.error_obj("API: " + "/loginUser", {
        message: "API Error: Email Not Found or Account Deactivated",
        value: { email },
        status: false,
      });
      return res.send({
        message: "Email Not Found or Account Deactivated",
        value: { email },
        status: false,
      });
    }

    const validation = await argon2.verify(user.password, password);

    if (!validation) {
      logger.error_obj("API: " + "/loginUser", {
        message: "API Error: Password Not Match",
        value: { email },
        status: false,
      });
      return res.send({ message: "Incorrect Password", status: false });
    }

    logger.info_obj("API: " + "/loginUser", {
      message: "API Done",
      main: email,
      status: true,
    });

    res.cookie("jid", createAccessToken(user));
    res.json({
      accessToken: createAccessToken(user),
      status: true,
      id: user.id,
      name: user.name,
      role: user.role,
      section: user.section,
    });
  } catch (e) {
    logger.error_obj("API: " + "/loginUser", {
      message: "API Failed: " + e,
      value: { email },
      status: false,
    });
    res.send({ message: e, value: email, status: false });
  }
});

UserRouter.post("/changePassword", async (req, res) => {
  const { newPassword, oldPassword, user_id } = req.body;
  try {
    const newPass = await argon2.hash(newPassword);

    const checkUser = await UserManager.findOne(User, { id: user_id });

    if (checkUser === undefined) {
      logger.error_obj("API: " + "/changePassword", {
        message: "API Error: User Not Found",
        value: { user_id },
        status: false,
      });
      return res.send({
        message: "User Not Found",
        value: { user_id },
        status: false,
      });
    }

    if (newPass === checkUser.password) {
      logger.error_obj("API: " + "/changePassword", {
        message: "API Error: Password Same With Previous One",
        value: { user_id },
        status: false,
      });
      return res.send({
        message: "Password Same With Previous One",
        value: { user_id },
        status: false,
      });
    }

    const checkOldPassword = await argon2.verify(
      checkUser.password,
      oldPassword
    );

    if (!checkOldPassword) {
      logger.error_obj("API: " + "/changePassword", {
        message: "API Error: Password Incorrect",
        value: { user_id },
        status: false,
      });
      return res.send({
        message: "Password Incorrect",
        value: { user_id },
        status: false,
      });
    }

    await UserManager.update(
      User,
      { id: user_id },
      {
        password: newPass,
      }
    )
      .then((data) => {
        logger.info_obj("API: " + "/changePassword", {
          message: "API Done",
          main: data,
          status: true,
        });
        res.send({
          data: `Password Changed Successfully`,
          main: data,
          status: true,
        });
      })
      .catch((e) => {
        logger.error_obj("API: " + "/changePassword", {
          message: "API Failed: " + e,
          value: { user_id },
          status: false,
        });
        res.send({ message: e, value: user_id, status: false });
      });
  } catch (e) {}
});

UserRouter.post("/changePasswordByEmail", async (req, res) => {
  const { email } = req.body;
  try {
    const userInfo = await UserManager.findOneOrFail(User, { email });
    const id = userInfo?.id;
    const lastPassword = userInfo?.password;

    const nodemailer = require("nodemailer");
    const jwt = require("jsonwebtoken");

    var payload = {
      id: id,
      email: email,
    };

    var secret = lastPassword;

    var token = jwt.sign(payload, secret, { expiresIn: 60 * 15 });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      port: 465,
      secure: true,
      auth: { user: "greatecherp.noreply@gmail.com", pass: "Greatech123" },
    });

    await transporter.sendMail({
      from: '"ERP Reset Password [DO NOT REPLY]????" <greatecherp.noreply@gmail.com>',
      to: email,
      subject: "ERP Reset Password", // Subject line
      html:
        "<p>Click <a href='http://192.168.0.24/ERPs/#/reset-password/" +
        id +
        "/" +
        token +
        "'>here</a> to reset your password</p>", // html body
    });

    logger.info_obj("API: " + "/changePasswordByEmail", {
      message: "API Done",
      main: email,
      status: true,
    });
    res.send({
      message: "Please Check Your Email Inbox (Spam, Junk) To Reset Password",
      status: true,
    });
  } catch (e) {
    logger.error_obj("API: " + "/changePasswordByEmail", {
      message: "API Failed: " + e,
      value: { email },
      status: false,
    });
    res.send({ message: e, status: false });
  }
});

UserRouter.post("/resetPassword", async (req, res) => {
  const { password, id, token } = req.body;
  try {
    const newPassword = await argon2.hash(password);
    const jwt = require("jsonwebtoken");
    console.log(id);
    const userInfo = await UserManager.findOneOrFail(User, { id });
    const lastPassword = userInfo?.password;

    try {
      jwt.verify(token, lastPassword);
    } catch (e) {
      logger.error_obj("API: " + "/resetPassword", {
        message: "API Error: " + e,
        status: false,
      });
      res.send({ message: "Unable To Verify The Token", status: false });
    }

    if (newPassword == lastPassword) {
      logger.error_obj("API: " + "/resetPassword", {
        message: "API Error: Password Same with Previous",
        status: false,
      });
      res.send({
        message: "Please Enter A Password Different Than the Old Password",
        status: false,
      });
    }

    await UserManager.update(User, { id: id }, { password: newPassword })
      .then((data) => {
        logger.info_obj("API: " + "/resetPassword", {
          message: "API Done: Successfully Change the password",
          status: true,
        });
        res.send({ message: "Successfully Change The Password", status: true });
      })
      .catch((e) => {
        logger.error_obj("API: " + "/resetPassword", {
          message: "API Error: " + e,
          status: false,
        });
        res.send({ message: "Unable To Change The Password", status: false });
      });
  } catch (e) {
    logger.error_obj("API: " + "/resetPassword", {
      message: "API Failed: " + e,
      status: false,
    });
    res.send({ message: e, status: false });
  }
});

module.exports = UserRouter;
