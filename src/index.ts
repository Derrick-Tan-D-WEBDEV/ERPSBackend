import "reflect-metadata";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { createConnections } from "typeorm";

var bodyParser = require('body-parser');
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger_output.json");

const main = async () => {
  const app = express();
  app.use(cookieParser());

  app.use(
    cors({
      origin: "*",
      credentials: true,
    })
  );

  await createConnections()
    .then(() => {
      console.log("connected to the database");
    })
    .catch((error) => {
      console.log(error);
    });

  app.use(express.json({limit: '50mb'}));
  app.use(express.urlencoded({limit: '50mb', extended: true}));

  app.get("/", (_req, res) => res.send("Successful Connection"));

  app.use("/SP", require("./routes/sp"));
  app.use("/User", require("./routes/user"));
  app.use("/UOM", require("./routes/uom"));
  app.use("/TypeItem", require("./routes/typeitem"));
  app.use("/Category", require("./routes/category"));
  app.use("/FormSettings", require("./routes/formsettings"));
  app.use("/TesterFormBuilder", require("./routes/TesterFormBuilder"));
  app.use("/Annoucement", require("./routes/news"));
  app.use("/Pending", require("./routes/pending"));
  app.use("/Other", require("./routes/other"));
  app.use("/Activity", require("./routes/activity"));
  app.use("/DMT", require("./routes/dmt"));
  app.use("/UserIcon", require("./routes/usericon"));
  app.use("/Brand", require("./routes/brand"));

  app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerFile));

  const PORT = process.env.PORT || 4000;

  app.listen(PORT, () => {
    console.log(`Server is listening to port:${PORT}`);
  });
};

main().catch((error) => {
  console.log(error);
});
