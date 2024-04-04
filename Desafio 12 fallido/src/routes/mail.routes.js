import { Router } from "express";
import nodemailer from "nodemailer";
import config from "../config/config.js";
import jwt from "jsonwebtoken";
import { restorePassword } from "../controllers/session.controller.js";
const mailRoutes = Router();

// mailRoutes.get("/send-mail", async (req, res) => {

//   const transport = nodemailer.createTransport({
//     service: "gmail",
//     port: 587,
//     auth: {
//       user: "mateobauti.maccarone@gmail.com",
//       pass: config.googlePassword,
//     },
//   });

//   try {
//     const result = await transport.sendMail({
//       from: "Ecommerce <mateobauti.maccarone@gmail.com>",
//       to: "mateobauti.maccarone2@gmail.com",
//       subject: "Este es un mail de prueba",
//       html: `
//             <div>
//                 <h1>
//                     Hola, prueba de mate
//                 </h1>
//             </div>
//         `,
//     });

//     res.send({ message: "Mail sent!" });
//   } catch (error) {
//     res.status(400).send({ message: "couldn't send the email" });
//   }
// });

mailRoutes.post("/restore-password-mail", restorePassword);

mailRoutes.get("/obteneruser", (req, res) => {});

export default mailRoutes;
