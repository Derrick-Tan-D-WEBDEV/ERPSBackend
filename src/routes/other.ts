import e, { Router } from "express";
import moment from "moment";
import { SP_Category } from "../entity/SP_Category";
import { getConnection, getManager, Like } from "typeorm";
import { StandardParts } from "../entity/SP";
import * as xlsx from 'xlsx';
import { LoggerService } from "../LoggerService";
import { PendingParts } from "../entity/SP_Pending";
import { ActivityLog } from "../entity/ActivityLog";
import { User } from "../entity/User";
import argon2 from "argon2";
import { SP_UomTypes } from "../entity/SP_Uom";

const logger = new LoggerService("other-api");
const OtherRouter = Router();
const OtherManager = getManager("standardPartsDB");

OtherRouter.get("/", async (_req, res) => {
    res.send("Connect To Others Successfully.");
})

OtherRouter.post("/checkPPNBrand", async (req, res) => {
    const { product_part_number, brand } = req.body;
    try {
        const checkRedundantPending = await OtherManager.findOne(PendingParts, {
            where: {
              product_part_number : product_part_number,
              brand: brand,
            },
        });
    
        const checkRedundantStdParts = await OtherManager.findOne(StandardParts, {
        where: {
            product_part_number: product_part_number,
            brand: brand,
        },
        });

        if (checkRedundantPending !== undefined || checkRedundantStdParts !== undefined ) {
            logger.info_obj("API: " + "/checkPPNBrand", {
                message: "API Done",
                status: true,
              });
              res.send({ message: `Redundant data on Product Part Number: ${product_part_number} and Brand: ${brand}`, status: true });
        }
        else {
            logger.info_obj("API: " + "/checkPPNBrand", {
                message: "API Done",
                status: true,
              });
              res.send({ message: `Done Checking`, status: true });
        }
    }
    catch(e) {
        logger.error_obj("API: " + "/checkPPNBrand", { 
            message: "API Failed: " + e,
            status: false,
          });
          res.send({ message: e, status: false });
    }
})

// Excel File Generator
OtherRouter.get("/genMechExcel", async (_req, res) => {
    try {
        const code = await OtherManager.find(SP_Category, { category_type : "Mechanical" });
        var wb = xlsx.utils.book_new();

        for (var i = 0; i < code.length; i++) {
            var worksheet = await OtherManager.findOne(SP_Category, { code : code[i]?.code })
            var worksheetcode = worksheet?.code
            var worksheetname = worksheet?.description

            var data = await OtherManager.createQueryBuilder(StandardParts, "SP")
                                         .innerJoinAndSelect("SP.user", "U")
                                         .select([
                                             "SP.erp_code AS erp_code",
                                             "SP.type_item AS type_item",
                                             "SP.product_part_number AS product_part_number",
                                             "SP.greatech_drawing_naming AS greatech_drawing_naming",
                                             "SP.description AS description",
                                             "SP.brand AS brand",
                                             "SP.uom AS uom",
                                             "SP.folder_location AS folder_location",
                                             "SP.remark AS remark",
                                             "SP.assign_material AS assign_material",
                                             "SP.assign_weight AS assign_weight"
                                         ])
                                         .addSelect(
                                            "CASE WHEN SP.update_date = '0000-00-00 00:00:00' THEN SP.insert_date ELSE SP.update_date END",
                                            "update_date"
                                          )
                                          .addSelect("U.name AS name")
                                         .where("SP.status = 1")
                                         .andWhere(`SP.erp_code LIKE "%${ worksheetcode }%"`)
                                         .getRawMany()

            if (data.length != 0) {
                var ws = xlsx.utils.json_to_sheet(data);
                ws.A1.v = 'ERP Code';
                ws.B1.v = 'Type Item';
                ws.C1.v = 'Product Part Number';
                ws.D1.v = 'Greatech Drawing Naming';
                ws.E1.v = 'Description';
                ws.F1.v = 'Brand';
                ws.G1.v = 'UOM';
                ws.H1.v = 'Folder Location';
                ws.I1.v = 'Remark';
                ws.J1.v = 'Assign Material';
                ws.K1.v = 'Assign Weight';
                ws.L1.v = 'Update Date';
                ws.M1.v = 'Update By';
                xlsx.utils.book_append_sheet(wb, ws, worksheetname);
            }
            else {
                continue
            }
        }
        xlsx.writeFile(wb, 'Mech.xlsx');
        logger.info_obj("API: " + "/genMechExcel", {
            message: "API Done",
            status: true,
        });
        res.download('./Mech.xlsx', 'Mech.xlsx')
    }
    catch(e) {
        logger.error_obj("API: " + "/genMechExcel", {
            message: "API Failed: " + e,
            status: false,
        });
        res.send({ message: e, status: false });
    }
})

OtherRouter.get("/genVisionExcel", async (_req, res) => {
    try {
        const code = await OtherManager.find(SP_Category, { category_type : "Vision" });
        var wb = xlsx.utils.book_new();

        for (var i = 0; i < code.length; i++) {
            var worksheet = await OtherManager.findOne(SP_Category, { code : code[i]?.code })
            var worksheetcode = worksheet?.code
            var worksheetname = worksheet?.description

            var data = await OtherManager.createQueryBuilder(StandardParts, "SP")
                                         .innerJoinAndSelect("SP.user", "U")
                                         .innerJoinAndSelect("SP.SPCategory", "C")
                                         .select("SP.erp_code AS erp_code")
                                         .addSelect("C.code AS code")
                                         .addSelect([
                                             "SP.type_item AS type_item",
                                             "SP.product_part_number AS product_part_number",
                                             "SP.greatech_drawing_naming AS greatech_drawing_naming",
                                             "SP.description AS description",
                                             "SP.brand AS brand",
                                             "SP._2d_folder AS _2d_folder", 
                                             "SP._3d_folder AS _3d_folder",
                                             "SP.solidworks_folder AS solidworks_folder", 
                                         ])
                                         .addSelect(
                                            "CASE WHEN SP.update_date = '0000-00-00 00:00:00' THEN SP.insert_date ELSE SP.update_date END",
                                            "update_date"
                                         )
                                         .addSelect("SP.remark AS remark")
                                         .addSelect("U.name AS name")
                                         .where("SP.status = 1")
                                         .andWhere(`SP.erp_code LIKE "%${ worksheetcode }%"`)
                                         .getRawMany()

            if (data.length != 0) {
                var ws = xlsx.utils.json_to_sheet(data);
                ws.A1.v = 'ERP Number';
                ws.B1.v = 'Type Code';
                ws.C1.v = 'Type Item'
                ws.D1.v = 'Product Part Number';
                ws.E1.v = 'Greatech Naming Drawing';
                ws.F1.v = 'Description';
                ws.G1.v = 'Brand'; 
                ws.H1.v = '2D Folder  Location';
                ws.I1.v = '3D Folder Location';
                ws.J1.v = 'SOLIDWORKS Folder Location';
                ws.K1.v = 'Update Date';
                ws.L1.v = 'Remark';
                ws.M1.v = 'Update By';
                xlsx.utils.book_append_sheet(wb, ws, worksheetcode);
            }
            else {
                continue
            }
        }
        xlsx.writeFile(wb, 'Vision.xlsx');
        logger.info_obj("API: " + "/genVisionExcel", {
            message: "API Done",
            status: true,
        });
        res.download('./Vision.xlsx', 'Vision.xlsx')
    }
    catch(e) {
        logger.error_obj("API: " + "/genVisionExcel", {
            message: "API Failed: " + e,
            status: false,
        });
        res.send({ message: e, status: false });
    }
})

OtherRouter.get("/genElectricalExcel", async (_req, res) => {
    try {
        const code = await OtherManager.find(SP_Category, { category_type : "Electrical" });
        var wb = xlsx.utils.book_new();

        for (var i = 0; i < code.length; i++) {
            var worksheet = await OtherManager.findOne(SP_Category, { code : code[i]?.code })
            var worksheetcode = worksheet?.code
            var worksheetname = worksheet?.description

            var data = await OtherManager.createQueryBuilder(StandardParts, "SP")
                                         .innerJoinAndSelect("SP.user", "U")
                                         .innerJoinAndSelect("SP.SPCategory", "C")
                                         .select([
                                             "SP.type_item AS type_item",
                                             "SP.product_part_number AS product_part_number",
                                             "SP.erp_code AS erp_code",
                                             "SP.description AS description",
                                             "SP.brand AS brand",
                                             "SP.uom AS uom",
                                             "SP._3d_folder AS _3d_folder",
                                         ])
                                         .addSelect("U.name AS name")
                                         .addSelect(
                                            "CASE WHEN SP.update_date = '0000-00-00 00:00:00' THEN SP.insert_date ELSE SP.update_date END",
                                            "update_date"
                                         )
                                         .addSelect("SP.remark AS remark")
                                         .where("SP.status = 1")
                                         .andWhere(`SP.erp_code LIKE "%${ worksheetcode }%"`)
                                         .getRawMany()

            if (data.length != 0) {
                var ws = xlsx.utils.json_to_sheet(data);
                ws.A1.v = 'Item Type';
                ws.B1.v = 'Product Part Number';
                ws.C1.v = 'ERP Number'
                ws.D1.v = 'Description';
                ws.E1.v = 'Brand';
                ws.F1.v = 'UOM';
                ws.G1.v = '3D Folder Location'; 
                ws.H1.v = 'Update By';
                ws.I1.v = 'Update Date';
                ws.J1.v = 'Remark';
                xlsx.utils.book_append_sheet(wb, ws, worksheetcode);
            }
            else {
                continue
            }
        }
        xlsx.writeFile(wb, 'Electrical.xlsx');
        logger.info_obj("API: " + "/genElectricalExcel", {
            message: "API Done",
            status: true,
        });
        res.download('./Electrical.xlsx', 'Electrical.xlsx')
    }
    catch(e) {
        logger.error_obj("API: " + "/genElectricalExcel", {
            message: "API Failed: " + e,
            status: false,
        });
        res.send({ message: e, status: false });
    }
})

OtherRouter.get("/genSoftwareExcel", async (_req, res) => {
    try {
        const code = await OtherManager.find(SP_Category, { category_type : "Software" });
        var wb = xlsx.utils.book_new();

        for (var i = 0; i < code.length; i++) {
            var worksheet = await OtherManager.findOne(SP_Category, { code : code[i]?.code })
            var worksheetcode = worksheet?.code
            var worksheetname = worksheet?.description

            var data = await OtherManager.createQueryBuilder(StandardParts, "SP")
                                         .innerJoinAndSelect("SP.user", "U")
                                         .innerJoinAndSelect("SP.SPCategory", "C")
                                         .select([
                                             "SP.type_item AS type_item",
                                             "SP.product_part_number AS product_part_number",
                                             "SP.erp_code AS erp_code",
                                             "SP.description AS description",
                                             "SP.brand AS brand",
                                             "SP.uom AS uom",
                                             "SP._3d_folder AS _3d_folder",
                                         ])
                                         .addSelect("U.name AS name")
                                         .addSelect(
                                            "CASE WHEN SP.update_date = '0000-00-00 00:00:00' THEN SP.insert_date ELSE SP.update_date END",
                                            "update_date"
                                         )
                                         .addSelect("SP.remark AS remark")
                                         .where("SP.status = 1")
                                         .andWhere(`SP.erp_code LIKE "%${ worksheetcode }%"`)
                                         .getRawMany()

            if (data.length != 0) {
                var ws = xlsx.utils.json_to_sheet(data);
                ws.A1.v = 'Item Type';
                ws.B1.v = 'Product Part Number';
                ws.C1.v = 'ERP Number'
                ws.D1.v = 'Description';
                ws.E1.v = 'Brand';
                ws.F1.v = 'UOM';
                ws.G1.v = '3D Folder Location'; 
                ws.H1.v = 'Update By';
                ws.I1.v = 'Update Date';
                ws.J1.v = 'Remark';
                xlsx.utils.book_append_sheet(wb, ws, worksheetcode);
            }
            else {
                continue
            }
        }
        xlsx.writeFile(wb, 'Softwareeeeee.xlsx');
        logger.info_obj("API: " + "/genSoftwareExcel", {
            message: "API Done",
            status: true,
        });
        res.download('./Software.xlsx', 'Software.xlsx')
    }
    catch(e) {
        logger.error_obj("API: " + "/genSoftwareExcel", {
            message: "API Failed: " + e,
            status: false,
        });
        res.send({ message: e, status: false });
    }
})

module.exports = OtherRouter