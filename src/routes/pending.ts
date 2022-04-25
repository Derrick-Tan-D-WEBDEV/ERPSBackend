import { Router } from "express";
import { PendingParts } from "../entity/SP_Pending";
import { getConnection, getManager } from "typeorm";
import moment from "moment";
import { SP_Category } from "../entity/SP_Category";
import { StandardParts } from "../entity/SP";
import axios from "axios";
import { LoggerService } from "../LoggerService";
import { ActivityLog } from "../entity/ActivityLog";

const logger = new LoggerService("pendingparts-api");
const PendingPartRouter = Router();
const PendingManager = getManager("standardPartsDB");

PendingPartRouter.get("/", async (_req, res) => {
    res.send({ message: "Pending Parts Connected", status: true });
})

PendingPartRouter.get("/getAllPendings", async (_req, res) => {
    try {
        await PendingManager.createQueryBuilder(PendingParts, "P")
            .innerJoinAndSelect("P.user", "U")
            .innerJoinAndSelect("P.spCategory", "C")
            // .innerJoinAndSelect("P.approveUser", "A")
            .select(["P.id AS id"])
            .addSelect(["U.fullname AS fullname", "U.id AS user_id"])
            .addSelect([
                "C.description AS category_desc",
                "C.category_type AS category_type",
            ])
            .addSelect([
                "P.type_item AS type_item",
                "P.product_part_number AS product_part_number",
                "P.greatech_drawing_naming AS greatech_drawing_naming",
                "P.description AS description",
                "P.brand AS brand",
                "P.uom AS uom",
                "P.folder_location AS folder_location",
                "P._2d_folder AS _2d_folder",
                "P._3d_folder AS _3d_folder",
                "P.solidworks_folder AS solidworks_folder",
                "P.insert_date AS insert_date",
                "P.update_date AS update_date",
                "P.remark AS remark",
                "P.assign_material AS assign_material",
                "P.assign_weight AS assign_weight",
                "P.vendor AS vendor",
                "P.approved_by AS approved_by",
                "P.sub AS sub",
                "P.section AS section"
            ])
            // .addSelect("A.fullname AS approved_by")
            .addSelect(
                `CASE WHEN P.status = 0 then 'Pending' 
                      WHEN P.status = 1 then 'Approved'
                      WHEN P.status = 2 then 'Rejected' 
                 END`,
                "status"
            )
            .orderBy("P.insert_date", "DESC")
            .getRawMany()
        .then((data) => {
            for (let [index, item] of data.entries()) {
                if (item.sub != "") {
                  let subString = JSON.parse(item.sub);
          
                  data[index].sub = subString.sub;
                }
            }
            logger.info_obj("API: " + "/getAllPendings", {
                message: "API Done",
                total: data.length,
                status: true,
            });
            res.send({ data, total: data.length, status: true });
        })
        .catch((e) => {
            logger.error_obj("API: " + "/getAllPendings", {
                message: "API Error: " + e,
                status: false,
            });
            res.send({ message: e, status: false });
        })
    }
    catch(e) {
        logger.error_obj("API: " + "/getAllPendings", {
            message: "API Failed: " + e,
            status: false,
        });
        res.send({ message: e, status: false });
    }
})

PendingPartRouter.get("/getAllPending", async (_req, res) => {
    try {
        await PendingManager.createQueryBuilder(PendingParts, "P")
            .innerJoinAndSelect("P.user", "U")
            .innerJoinAndSelect("P.spCategory", "C")
            // .innerJoinAndSelect("P.approveUser", "A")
            .select(["P.id AS id"])
            .addSelect(["U.fullname AS fullname", "U.id AS user_id"])
            .addSelect([
                "C.description AS category_desc",
                "C.category_type AS category_type",
            ])
            .addSelect([
                "P.type_item AS type_item",
                "P.product_part_number AS product_part_number",
                "P.greatech_drawing_naming AS greatech_drawing_naming",
                "P.description AS description",
                "P.brand AS brand",
                "P.uom AS uom",
                "P.folder_location AS folder_location",
                "P._2d_folder AS _2d_folder",
                "P._3d_folder AS _3d_folder",
                "P.solidworks_folder AS solidworks_folder",
                "P.insert_date AS insert_date",
                "P.update_date AS update_date",
                "P.remark AS remark",
                "P.assign_material AS assign_material",
                "P.assign_weight AS assign_weight",
                "P.vendor AS vendor",
                "P.approved_by AS approved_by",
                "P.sub AS sub",
                "P.section AS section"
            ])
            .addSelect(
                `CASE WHEN P.status = 0 then 'Pending' 
                      WHEN P.status = 1 then 'Approved'
                      WHEN P.status = 2 then 'Rejected' 
                 END`,
                "status"
            )
            .where("P.status = 0")
            .orderBy("P.insert_date", "DESC")
            .getRawMany()
        .then((data) => {
            for (let [index, item] of data.entries()) {
                if (item.sub != "") {
                  let subString = JSON.parse(item.sub);
          
                  data[index].sub = subString.sub;
                }
            }
            logger.info_obj("API: " + "/getAllPending", {
                message: "API Done",
                total: data.length,
                status: true,
            });
            res.send({ data, total: data.length, status: true });
        })
        .catch((e) => {
            logger.error_obj("API: " + "/getAllPending", {
                message: "API Error: " + e,
                status: false,
            });
            res.send({ message: e, status: false });
        })
    }
    catch(e) {
        logger.error_obj("API: " + "/getAllPending", {
            message: "API Failed: " + e,
            status: false,
        });
        res.send({ message: e, status: false });
    }
})

PendingPartRouter.get("/getAllApproved", async (_req, res) => {
    try {
        await PendingManager.createQueryBuilder(PendingParts, "P")
            .innerJoinAndSelect("P.user", "U")
            .innerJoinAndSelect("P.spCategory", "C")
            // .innerJoinAndSelect("P.approveUser", "A")
            .select(["P.id AS id"])
            .addSelect(["U.fullname AS fullname", "U.id AS user_id"])
            .addSelect([
                "C.description AS category_desc",
                "C.category_type AS category_type",
            ])
            .addSelect([
                "P.type_item AS type_item",
                "P.product_part_number AS product_part_number",
                "P.greatech_drawing_naming AS greatech_drawing_naming",
                "P.description AS description",
                "P.brand AS brand",
                "P.uom AS uom",
                "P.folder_location AS folder_location",
                "P._2d_folder AS _2d_folder",
                "P._3d_folder AS _3d_folder",
                "P.solidworks_folder AS solidworks_folder",
                "P.insert_date AS insert_date",
                "P.update_date AS update_date",
                "P.remark AS remark",
                "P.assign_material AS assign_material",
                "P.assign_weight AS assign_weight",
                "P.vendor AS vendor",
                "P.approved_by AS approved_by",
                "P.sub AS sub",
                "P.section AS section"
            ])
            .addSelect(
                `CASE WHEN P.status = 0 then 'Pending' 
                      WHEN P.status = 1 then 'Approved'
                      WHEN P.status = 2 then 'Rejected' 
                 END`,
                "status"
            )
            .where("P.status = 1")
            .orderBy("P.insert_date", "DESC")
            .getRawMany()
        .then((data) => {
            for (let [index, item] of data.entries()) {
                if (item.sub != "") {
                  let subString = JSON.parse(item.sub);
          
                  data[index].sub = subString.sub;
                }
            }
            logger.info_obj("API: " + "/getAllApproved", {
                message: "API Done",
                total: data.length,
                status: true,
            });
            res.send({ data, total: data.length, status: true });
        })
        .catch((e) => {
            logger.error_obj("API: " + "/getAllApproved", {
                message: "API Error: " + e,
                status: false,
            });
            res.send({ message: e, status: false });
        })
    }
    catch(e) {
        logger.error_obj("API: " + "/getAllApproved", {
            message: "API Failed: " + e,
            status: false,
        });
        res.send({ message: e, status: false });
    }
})

PendingPartRouter.get("/getAllRejected", async (_req, res) => {
    try {
        await PendingManager.createQueryBuilder(PendingParts, "P")
            .innerJoinAndSelect("P.user", "U")
            .innerJoinAndSelect("P.spCategory", "C")
            // .innerJoinAndSelect("P.approveUser", "A")
            .select(["P.id AS id"])
            .addSelect(["U.fullname AS fullname", "U.id AS user_id"])
            .addSelect([
                "C.description AS category_desc",
                "C.category_type AS category_type",
            ])
            .addSelect([
                "P.type_item AS type_item",
                "P.product_part_number AS product_part_number",
                "P.greatech_drawing_naming AS greatech_drawing_naming",
                "P.description AS description",
                "P.brand AS brand",
                "P.uom AS uom",
                "P.folder_location AS folder_location",
                "P._2d_folder AS _2d_folder",
                "P._3d_folder AS _3d_folder",
                "P.solidworks_folder AS solidworks_folder",
                "P.insert_date AS insert_date",
                "P.update_date AS update_date",
                "P.remark AS remark",
                "P.assign_material AS assign_material",
                "P.assign_weight AS assign_weight",
                "P.vendor AS vendor",
                "P.approved_by AS approved_by",
                "P.sub AS sub",
                "P.section AS section"
            ])
            .addSelect(
                `CASE WHEN P.status = 0 then 'Pending' 
                      WHEN P.status = 1 then 'Approved'
                      WHEN P.status = 2 then 'Rejected' 
                 END`,
                "status"
            )
            .where("P.status = 2")
            .orderBy("P.insert_date", "DESC")
            .getRawMany()
        .then((data) => {
            for (let [index, item] of data.entries()) {
                if (item.sub != "") {
                  let subString = JSON.parse(item.sub);
          
                  data[index].sub = subString.sub;
                }
            }
            logger.info_obj("API: " + "/getAllRejected", {
                message: "API Done",
                total: data.length,
                status: true,
            });
            res.send({ data, total: data.length, status: true });
        })
        .catch((e) => {
            logger.error_obj("API: " + "/getAllRejected", {
                message: "API Error: " + e,
                status: false,
            });
            res.send({ message: e, status: false });
        })
    }
    catch(e) {
        logger.error_obj("API: " + "/getAllRejected", {
            message: "API Failed: " + e,
            status: false,
        });
        res.send({ message: e, status: false });
    }
})

PendingPartRouter.post("/getAllBySection", async (req, res) => {
    const { sect } = req.body;
    try {
        await PendingManager.createQueryBuilder(PendingParts, "P")
            .innerJoinAndSelect("P.user", "U")
            .innerJoinAndSelect("P.spCategory", "C")
            // .innerJoinAndSelect("P.approveUser", "A")
            .select(["P.id AS id"])
            .addSelect(["U.fullname AS fullname", "U.id AS user_id"])
            .addSelect([
                "C.description AS category_desc",
                "C.category_type AS category_type",
            ])
            .addSelect([
                "P.type_item AS type_item",
                "P.product_part_number AS product_part_number",
                "P.greatech_drawing_naming AS greatech_drawing_naming",
                "P.description AS description",
                "P.brand AS brand",
                "P.uom AS uom",
                "P.folder_location AS folder_location",
                "P._2d_folder AS _2d_folder",
                "P._3d_folder AS _3d_folder",
                "P.solidworks_folder AS solidworks_folder",
                "P.insert_date AS insert_date",
                "P.update_date AS update_date",
                "P.remark AS remark",
                "P.assign_material AS assign_material",
                "P.assign_weight AS assign_weight",
                "P.vendor AS vendor",
                "P.approved_by AS approved_by",
                "P.sub AS sub",
                "P.section AS section"
            ])
            .addSelect(
                `CASE WHEN P.status = 0 then 'Pending' 
                      WHEN P.status = 1 then 'Approved'
                      WHEN P.status = 2 then 'Rejected' 
                 END`,
                "status"
            )
            .where(`P.section = ${ sect }`)
            .orderBy("P.insert_date", "DESC")
            .getRawMany()
        .then((data) => {
            for (let [index, item] of data.entries()) {
                if (item.sub != "") {
                  let subString = JSON.parse(item.sub);
          
                  data[index].sub = subString.sub;
                }
            }
            logger.info_obj("API: " + "/getAllBySection", {
                message: "API Done",
                total: data.length,
                value : sect,
                status: true,
            });
            res.send({ data, total: data.length, status: true });
        })
        .catch((e) => {
            logger.error_obj("API: " + "/getAllBySection", {
                message: "API Error: " + e,
                value : sect,
                status: false,
            });
            res.send({ message: e, status: false });
        })
    }
    catch(e) {
        logger.error_obj("API: " + "/getAllBySection", {
            message: "API Failed: " + e,
            value : sect,
            status: false,
        });
        res.send({ message: e, status: false });
    }
})

PendingPartRouter.post("/getAllByUser", async (req, res) => {
    const { user_id } = req.body;
    try {
        await PendingManager.createQueryBuilder(PendingParts, "P")
            .innerJoinAndSelect("P.user", "U")
            .innerJoinAndSelect("P.spCategory", "C")
            // .innerJoinAndSelect("P.approveUser", "A")
            .select(["P.id AS id"])
            .addSelect(["U.fullname AS fullname", "U.id AS user_id"])
            .addSelect([
                "C.description AS category_desc",
                "C.category_type AS category_type",
            ])
            .addSelect([
                "P.type_item AS type_item",
                "P.product_part_number AS product_part_number",
                "P.greatech_drawing_naming AS greatech_drawing_naming",
                "P.description AS description",
                "P.brand AS brand",
                "P.uom AS uom",
                "P.folder_location AS folder_location",
                "P._2d_folder AS _2d_folder",
                "P._3d_folder AS _3d_folder",
                "P.solidworks_folder AS solidworks_folder",
                "P.insert_date AS insert_date",
                "P.update_date AS update_date",
                "P.remark AS remark",
                "P.assign_material AS assign_material",
                "P.assign_weight AS assign_weight",
                "P.vendor AS vendor",
                "P.approved_by AS approved_by",
                "P.sub AS sub",
                "P.section AS section"
            ])
            .addSelect(
                `CASE WHEN P.status = 0 then 'Pending' 
                    WHEN P.status = 1 then 'Approved'
                    WHEN P.status = 2 then 'Rejected' 
                END`,
                "status"
            )
            .where(`P.user_id = ${ user_id }`)
            .orderBy("P.insert_date", "DESC")
            .getRawMany()
        .then((data) => {
            for (let [index, item] of data.entries()) {
                if (item.sub != "") {
                  let subString = JSON.parse(item.sub);
          
                  data[index].sub = subString.sub;
                }
            }
            logger.info_obj("API: " + "/getAllByUser", {
                message: "API Done",
                total: data.length,
                value : user_id,
                status: true,
            });
            res.send({ data, total: data.length, status: true });
        })
        .catch((e) => {
            logger.error_obj("API: " + "/getAllByUser", {
                message: "API Error: " + e,
                value : user_id,
                status: false,
            });
            res.send({ message: e, status: false });
        })
    }
    catch(e) {
        logger.error_obj("API: " + "/getAllByUser", {
            message: "API Failed: " + e,
            value : user_id,
            status: false,
        });
        res.send({ message: e, status: false });
    }
})

PendingPartRouter.post("/getAllByCategory", async (req, res) => {
    const { part_id } = req.body
    try {
        await PendingManager.createQueryBuilder(PendingParts, "P")
            .innerJoinAndSelect("P.user", "U")
            .innerJoinAndSelect("P.spCategory", "C")
            // .innerJoinAndSelect("P.approveUser", "A")
            .select(["P.id AS id"])
            .addSelect(["U.fullname AS fullname", "U.id AS user_id"])
            .addSelect([
                "C.description AS category_desc",
                "C.category_type AS category_type",
            ])
            .addSelect([
                "P.type_item AS type_item",
                "P.product_part_number AS product_part_number",
                "P.greatech_drawing_naming AS greatech_drawing_naming",
                "P.description AS description",
                "P.brand AS brand",
                "P.uom AS uom",
                "P.folder_location AS folder_location",
                "P._2d_folder AS _2d_folder",
                "P._3d_folder AS _3d_folder",
                "P.solidworks_folder AS solidworks_folder",
                "P.insert_date AS insert_date",
                "P.update_date AS update_date",
                "P.remark AS remark",
                "P.assign_material AS assign_material",
                "P.assign_weight AS assign_weight",
                "P.vendor AS vendor",
                "P.approved_by AS approved_by",
                "P.sub AS sub",
                "P.section AS section"
            ])
            .addSelect(
                `CASE WHEN P.status = 0 then 'Pending' 
                    WHEN P.status = 1 then 'Approved'
                    WHEN P.status = 2 then 'Rejected' 
                END`,
                "status"
            )
            .where(`P.part_id = ${ part_id }`)
            .orderBy("P.insert_date", "DESC")
            .getRawMany()
        .then((data) => {
            for (let [index, item] of data.entries()) {
                if (item.sub != "") {
                  let subString = JSON.parse(item.sub);
          
                  data[index].sub = subString.sub;
                }
            }
            logger.info_obj("API: " + "/getPendingByCategorys", {
                message: "API Done",
                total: data.length,
                value : part_id,
                status: true,
            });
            res.send({ data, total: data.length, status: true });
        })
        .catch((e) => {
            logger.error_obj("API: " + "/getPendingByCategorys", {
                message: "API Error: " + e,
                value : part_id,
                status: false,
            });
            res.send({ message: e, status: false });
        })
    }
    catch(e) {
        logger.error_obj("API: " + "/getPendingByCategorys", {
            message: "API Failed: " + e,
            value : part_id,
            status: false,
        });
        res.send({ message: e, status: false });
    }
})

PendingPartRouter.post("/getOnePending", async (req, res) => {
    const { id } = req.body;
    try {
        await PendingManager.createQueryBuilder(PendingParts, "P")
            .innerJoinAndSelect("P.user", "U")
            .innerJoinAndSelect("P.spCategory", "C")
            // .innerJoinAndSelect("P.approveUser", "A")
            .select(["P.id AS id"])
            .addSelect(["U.fullname AS fullname", "U.id AS user_id"])
            .addSelect([
                "C.description AS category_desc",
                "C.category_type AS category_type",
            ])
            .addSelect([
                "P.type_item AS type_item",
                "P.product_part_number AS product_part_number",
                "P.greatech_drawing_naming AS greatech_drawing_naming",
                "P.description AS description",
                "P.brand AS brand",
                "P.uom AS uom",
                "P.folder_location AS folder_location",
                "P._2d_folder AS _2d_folder",
                "P._3d_folder AS _3d_folder",
                "P.solidworks_folder AS solidworks_folder",
                "P.insert_date AS insert_date",
                "P.update_date AS update_date",
                "P.remark AS remark",
                "P.assign_material AS assign_material",
                "P.assign_weight AS assign_weight",
                "P.vendor AS vendor",
                "P.approved_by AS approved_by",
                "P.sub AS sub",
                "P.section AS section"
            ])
            .addSelect(
                `CASE WHEN P.status = 0 then 'Pending' 
                    WHEN P.status = 1 then 'Approved'
                    WHEN P.status = 2 then 'Rejected' 
                END`,
                "status"
            )
            .where(`P.id = ${ id }`)
            .getRawMany()
        .then((data) => {
            for (let [index, item] of data.entries()) {
                if (item.sub != "") {
                  let subString = JSON.parse(item.sub);
          
                  data[index].sub = subString.sub;
                }
            }
            logger.info_obj("API: " + "/getOnePending", {
                message: "API Done",
                total: data.length,
                value : id,
                status: true,
            });
            res.send({ data, total: data.length, status: true });
        })
        .catch((e) => {
            logger.error_obj("API: " + "/getOnePending", {
                message: "API Error: " + e,
                value : id,
                status: false,
            });
            res.send({ message: e, status: false });
        })
    }
    catch(e) {
        logger.error_obj("API: " + "/getOnePending", {
            message: "API Failed: " + e,
            value : id,
            status: false,
        });
        res.send({ message: e, status: false });
    }
})

PendingPartRouter.post("/approvePending", async (req, res) => {
    const { id, user_id } = req.body;
    const currentDatetime = moment().format()
    var data: any = {};
    try {
        const pending_part = await PendingManager.createQueryBuilder(PendingParts, "P")
                                .innerJoinAndSelect("P.approveUser", "AU")
                                .innerJoinAndSelect("P.spCategory", "C")
                                // .innerJoinAndSelect("P.approveUser", "A")
                                .select(["P.id AS id"])
                                .addSelect(["AU.id AS user_id"])
                                .addSelect(["C.id AS part_id"])
                                .addSelect([
                                    "P.type_item AS type_item",
                                    "P.product_part_number AS product_part_number",
                                    "P.greatech_drawing_naming AS greatech_drawing_naming",
                                    "P.description AS description",
                                    "P.brand AS brand",
                                    "P.uom AS uom",
                                    "P.folder_location AS folder_location",
                                    "P._2d_folder AS _2d_folder",
                                    "P._3d_folder AS _3d_folder",
                                    "P.solidworks_folder AS solidworks_folder",
                                    "P.insert_date AS insert_date",
                                    "P.update_date AS update_date",
                                    "P.remark AS remark",
                                    "P.assign_material AS assign_material",
                                    "P.assign_weight AS assign_weight",
                                    "P.vendor AS vendor",
                                    "P.approved_by AS approved_by",
                                    "P.sub AS subs",
                                    "P.section AS section",
                                    "P.status AS status"
                                ])
                                .where(`P.id = ${ id }`)
                                .getRawOne()

        if (pending_part.status != 0 ) {
            logger.error_obj("API: " + "/approvePending", {
                message: "API Error: Part Already Accepted or Rejected",
                value : id,
                status: false,
            });
            res.send({ message: "API Error: Part Already Accepted or Rejected", status: false });
        }

        if (pending_part.subs != "") {
            let subString = JSON.parse(pending_part.subs);

            pending_part.subs = subString.all_sub;

            console.log(pending_part.subs)

            data.data = pending_part;

            const resp = await axios({
                method : "post",
                url : "http://192.168.0.24:4000/SP/addPendingSPMS",
                data : data
            })
            
            const erpNum = resp.data.main.erp_code

            await PendingManager.update(PendingParts, { id }, 
                {
                    status : 1, 
                    approved_by : user_id,
                    update_date : currentDatetime
                }
            )
            .then((data) => {
                logger.info_obj("API: " + "/approvePending", {
                    message: "API Done",
                    data : erpNum,
                    value : { id, user_id },
                    status: true,
                });
                res.send({ data, erp_code : erpNum, status : true });
            })
            .catch((e) => {
                logger.error_obj("API: " + "/approvePending", {
                    message: "API Error: " + e,
                    value : { id, user_id },
                    status: false,
                });
                res.send({ message: e, status: false });
            })
        }

        if (pending_part.subs == "") {
            data.data = pending_part;

            const resp = await axios({
                method : "post",
                url : "http://192.168.0.24:4000/SP/addPendingSP",
                data : data
            })
            
            const erpNum = resp.data.main.erp_code

            await PendingManager.update(PendingParts, { id }, 
                {
                    status : 1, 
                    approved_by : user_id,
                    update_date : currentDatetime
                }
            )
            .then((data) => {
                logger.info_obj("API: " + "/approvePending", {
                    message: "API Done",
                    data : erpNum,
                    value : { id, user_id },
                    status: true,
                });
                res.send({ data, erp_code : erpNum, status : true });
            })
            .catch((e) => {
                logger.error_obj("API: " + "/approvePending", {
                    message: "API Error: " + e,
                    value : { id, user_id },
                    status: false,
                });
                res.send({ message: e, status: false });
            })
        }
    }
    catch(e) {
        logger.error_obj("API: " + "/approvePending", {
            message: "API Failed: " + e,
            value : { id, user_id },
            status: false,
        });
        res.send({ message: e, status: false });
    }
})

PendingPartRouter.post("/declinePending", async (req, res) => {
    const { id, user_id } = req.body;
    const currentDatetime = moment().format();
    try {
        await PendingManager.update(PendingParts, { id }, 
            {
                approved_by : user_id,
                status : 2,
                update_date : currentDatetime
            }
        )
        .then((data) => {
            logger.info_obj("API: " + "/declinePending", {
                message: "API Done",
                value : { id, user_id },
                status: true,
            });
            res.send({ data, value : { id, user_id }, status : true });
        })
        .catch((e) => {
            logger.error_obj("API: " + "/declinePending", {
                message: "API Error: " + e,
                value : { id, user_id },
                status: false,
            });
            res.send({ message: e, status: false });
        })
    }
    catch(e) {
        logger.error_obj("API: " + "/declinePending", {
            message: "API Failed: " + e,
            value : { id, user_id },
            status: false,
        });
        res.send({ message: e, status: false });
    }
})

PendingPartRouter.post("/addSPPending", async (req, res) => {
    const data = req.body;
    console.log(data)
    try {
        const currentDatetime = moment().format();
        const part_id = data.category.Category_id;
        const section = data.category.Category_category_type;
        const type_item = data.type_item.TypeItems_type_item;
        const vendor = data.vendor;
        const ppn = data.product_part_number;
        const u_id = data.user_id;
        var vdr = "";

        const code = await PendingManager.findOne(SP_Category, { id: part_id });
        const initial = code?.code;

        if (initial === undefined) {
            logger.error_obj("API: " + "/addSPPending", {
                message: "API Error: " + `Unable to find code ${part_id}.`,
                status: false,
            });
            return res.send({
                message: `Unable to find code ${part_id}.`,
                status: false,
            });
        }

        if (vdr == "Local Vendor") {
            vdr = "LV";
        }
        if (vdr == "Appointed Vendor") {
            vdr = "AV";
        }

        const mainResult = {
            user_id : u_id,
            part_id : part_id,
            type_item : type_item,
            product_part_number : ppn,
            greatech_drawing_naming : data.greatech_drawing_naming,
            description : data.description,
            brand : data.brand,
            uom : data.uom,
            folder_location : data.folder_location,
            _2d_folder : data._2d_folder,
            _3d_folder : data._3d_folder,
            solidworks_folder : data.solidworks_folder,
            insert_date : currentDatetime,
            remark : data.remark,
            assign_material : data.assign_material,
            assign_weight : data.assign_weight,
            vendor : vdr,
            status : 0,
            sub : "",
            section : section
        }

        const checkRedundantPending = await PendingManager.findOne(PendingParts, {
            where: {
                product_part_number: data.product_part_number,
                brand: data.brand,
            },
        });
      
        const checkRedundantStdParts = await PendingManager.findOne(StandardParts, {
            where: {
                product_part_number: data.product_part_number,
                brand: data.brand,
            },
        });

        if ( checkRedundantPending !== undefined ||
            checkRedundantStdParts !== undefined ) {
            logger.error_obj("API: " + "/addSPPending", {
                message:
                "API Error: " +
                `Redundant on ProductPartNumber ${data.product_part_number} and Brand ${data.brand}.`,
                status: false,
            });
            return res.send({
                message: `Redundant on ProductPartNumber ${data.product_part_number} and Brand ${data.brand}`,
                status: false,
            });
        }

        await PendingManager.insert(PendingParts, mainResult)
        .then((data) => {
            logger.info_obj("API: " + "/addSPPending", {
                message: "API Done",
                value : data,
                status: true,
            });
            res.send({ data, value : data, status : true });
        })
        .catch((e) => {
            logger.error_obj("API: " + "/addSPPending", {
                message: "API Error: " + e,
                value : data,
                status: false,
            });
            res.send({ message: e, status: false });
        })
    }
    catch(e) {
        logger.error_obj("API: " + "/addSPPending", {
            message: "API Failed: " + e,
            value : data,
            status: false,
        });
        res.send({ message: e, status: false });
    }
})

PendingPartRouter.post("/addSPMSPending", async (req, res) => {
    const data = req.body;
    console.log(data)
    try {
        const currentDatetime = moment().format();
        const section = data.category.Category_category_type;
        const type_item = data.type_item.TypeItems_type_item;
        const vendor = data.vendor;
        const part_desc = data.category.Category_id;
        const subs = data.subs;
        const ppn = data.product_part_number;
        const u_id = data.user_id;

        const code = await PendingManager.findOne(SP_Category, { id: part_desc });
        const initial = code?.code;
        const part_id = code?.id;

        if (initial === undefined) {
            logger.error_obj("API: " + "/addSPMSPending", {
                message: "API Error: " + `Unable to find code ${part_id}.`,
                status: false,
            });
            return res.send({
                message: `Unable to find code ${part_id}.`,
                status: false,
            });
        }

        var all_sub = [];
        var erp_part: any[] = [];

        for (let [_index, element] of subs.entries()) {
            _index ++;

            const checkRedundantPending = await PendingManager.findOne(PendingParts, {
                where: {
                    product_part_number: data.product_part_number,
                    brand: data.brand,
                },
            });
          
            const checkRedundantStdParts = await PendingManager.findOne(StandardParts, {
                where: {
                    product_part_number: data.product_part_number,
                    brand: data.brand,
                },
            });

            if ( checkRedundantPending !== undefined ||
                checkRedundantStdParts !== undefined ) {
                logger.error_obj("API: " + "/addSPMSPending", {
                    message:
                    "API Error: " +
                    `Redundant on (Subs) ProductPartNumber ${data.product_part_number} and Brand ${data.brand}.`,
                    status: false,
                });
                return res.send({
                    message: `Redundant on (Subs) ProductPartNumber ${data.product_part_number} and Brand ${data.brand}`,
                    status: false,
                });
            }

            var get_value = {
                part_number: element.product_part_number,
            };

            var sub_temp = {
                user_id : u_id,
                part_id : part_id,
                type_item : element.type_item.TypeItems_type_item,
                product_part_number : element.product_part_number,
                greatech_drawing_naming : element.greatech_drawing_naming,
                description : element.description,
                brand : element.brand,
                uom : element.uom,
                folder_location : element.folder_location,
                _2d_folder : element._2d_folder,
                _3d_folder : element._3d_folder,
                solidworks_folder : element.solidworks_folder,
                insert_date : currentDatetime,
                remark : element.remark,
                assign_material : element.assign_material,
                assign_weight : element.assign_weight,
                vendor : "",
                status : 0,
                section : section
            };

            all_sub.push(sub_temp);
            erp_part.push(get_value);
        }

        let subArray = { all_sub }
        let subString = JSON.stringify(subArray)

        const mainResult = {
            user_id : u_id,
            part_id : part_id,
            type_item : type_item,
            product_part_number : ppn,
            greatech_drawing_naming : data.greatech_drawing_naming,
            description : data.description,
            brand : data.brand,
            uom : data.uom,
            folder_location : data.folder_location,
            _2d_folder : data._2d_folder,
            _3d_folder : data._3d_folder,
            solidworks_folder : data.solidworks_folder,
            insert_date : currentDatetime,
            remark : data.remark,
            assign_material : data.assign_material,
            assign_weight : data.assign_weight,
            vendor : vendor,
            status : 0,
            sub : subString,
            section : section
        }

        const checkRedundantPending = await PendingManager.findOne(PendingParts, {
            where: {
                product_part_number: data.product_part_number,
                brand: data.brand,
            },
        });
      
        const checkRedundantStdParts = await PendingManager.findOne(StandardParts, {
            where: {
                product_part_number: data.product_part_number,
                brand: data.brand,
            },
        });

        if ( checkRedundantPending !== undefined ||
            checkRedundantStdParts !== undefined ) {
            logger.error_obj("API: " + "/addSPMSPending", {
                message:
                "API Error: " +
                `Redundant on ProductPartNumber ${data.product_part_number} and Brand ${data.brand}.`,
                status: false,
            });
            return res.send({
                message: `Redundant on ProductPartNumber ${data.product_part_number} and Brand ${data.brand}`,
                status: false,
            });
        }

        await PendingManager.insert(PendingParts, mainResult)
        .then((data) => {
            logger.info_obj("API: " + "/addSPMSPending", {
                message: "API Done",
                value : data,
                status: true,
            });
            res.send({ data, value : data, status : true });
        })
        .catch((e) => {
            logger.error_obj("API: " + "/addSPMSPending", {
                message: "API Error: " + e,
                value : data,
                status: false,
            });
            res.send({ message: e, status: false });
        })
    }
    catch(e) {
        logger.error_obj("API: " + "/addSPMSPending", {
            message: "API Failed: " + e,
            value : data,
            status: false,
        });
        res.send({ message: e, status: false });
    }
})

PendingPartRouter.post("/editPending", async (req, res) => {
    const { data } = req.body;
    try {
        const currentDatetime = moment().format();
        const {
            id,
            type_item,
            product_part_number,
            greatech_drawing_naming,
            description,
            brand,
            uom,
            folder_location,
            _2d_folder,
            _3d_folder,
            solidworks_folder,
            insert_date,
            update_date,
            remark,
            assign_material,
            assign_weight,
            vendor, 
            approved_by,
            sub,
            section
        } = data;

        const subCheckRedundantPending = await PendingManager.findOne(PendingParts, {
            where: {
              product_part_number: data.product_part_number,
              brand: data.brand,
            },
        });

        const subCheckRedundantStdParts = await PendingManager.findOne(StandardParts, {
            where: {
                product_part_number: data.product_part_number,
                brand: data.brand,
            },
        });
    
        if (
        subCheckRedundantPending !== undefined ||
        subCheckRedundantStdParts !== undefined
        ) {
            logger.error_obj("API: " + "/editPending", {
                message:
                "API Error: " +
                `Redundant on ProductPartNumber ${data.product_part_number} and Brand ${data.brand}.`,
                status: false,
            });
            return res.send({
                message: `Redundant on ProductPartNumber ${data.product_part_number} and Brand ${data.brand}`,
                status: false,
            });
        }

        await PendingManager.update(PendingParts, { id },
            {
                type_item,
                product_part_number,
                greatech_drawing_naming,
                description,
                brand,
                uom,
                folder_location,
                _2d_folder,
                _3d_folder,
                solidworks_folder,
                insert_date,
                update_date : currentDatetime,
                remark,
                assign_material,
                assign_weight,
                vendor, 
                approved_by,
                sub,
                section
            }
        )
        .then((data) => {
            logger.info_obj("API: " + "/editPending", {
                message: "API Done",
                main: data,
                status: true,
              });
              res.send({
                data: `Update Successfully`,
                main: data,
                status: true,
              });
        })
        .catch((e) => {
            logger.error_obj("API: " + "/editPending", {
                message: "API Error" + e,
                value: data,
                status: false,
              });
              res.send({
                data: `Error On Update Edited Pending Part On DB: ` + e,
                status: false,
              });
        })
    }
    catch(e) {
        logger.error_obj("API: " + "/editPending", {
            message: "API Failed: " + e,
            value : data,
            status: false,
        });
        res.send({ message: e, status: false });
    }
})

module.exports = PendingPartRouter