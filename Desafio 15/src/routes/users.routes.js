import { Router } from "express";
import { checkAuth } from "../middlewares/auth.js";
import UserRepository from "../dao/repositories/session.repository.js";
import { userModel } from "../dao/models/user.model.js";
import UserDTO from "../dtos/user.dto.js";
import upload from "../utils/multer.js";
const userRepository = new UserRepository(userModel);

const userRoutes = Router();
userRoutes.put("/premium/:uid", checkAuth, async (req, res) => {
  const { uid } = req.params;

  try {
    const user = await userRepository.getUserById(uid);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.role === "premium") {
      return res.status(400).json({ error: "The user is already premium" });
    }

    const requiredDocuments = [
      "Identificacion",
      "Comprobante de domicilio",
      "Comprobante de estado de cuenta",
    ];
    const uploadedDocuments = user.documents.map((doc) => doc.name);
    const hasAllRequiredDocuments = requiredDocuments.every((doc) =>
      uploadedDocuments.includes(doc)
    );

    if (!hasAllRequiredDocuments) {
      return res.status(400).json({
        error: "The user has not finished processing their documentation",
      });
    }

    if (user.role === "user") {
      user.role = "premium";
      await user.save();
    }

    const userDTO = new UserDTO(user);
    res.json({ message: "User role updated successfully", user: userDTO });
  } catch (error) {
    console.error("Error updating user role:", error);
    res.status(500).json({ error: "Error updating user role" });
  }
});

userRoutes.post(
  "/:uid/documents",
  upload.array("documents", 5),
  async (req, res) => {
    try {
      const { uid } = req.params;
      const documents = req.files.map((file) => ({
        name: file.originalname,
        reference: file.path,
      }));

      const user = await userRepository.getUserById(uid);
      if (!user) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      user.documents.push(...documents);

      await user.save();
      return res
        .status(200)
        .json({ message: "Documentos subidos exitosamente", documents });
    } catch (error) {
      console.error("Error al subir documentos:", error);
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  }
);

export default userRoutes;
