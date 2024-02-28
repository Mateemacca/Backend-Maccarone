import { Router } from "express";
import { getCurrentUser, githubCallback, githubCallbackHandler, githubLogin, loginUser, logoutUser, registerUser, restorePassword } from "../controllers/session.controller.js";

const sessionRoutes = Router();



sessionRoutes.get('/current',getCurrentUser)
sessionRoutes.post('/register',registerUser)
sessionRoutes.post('/login', loginUser)
sessionRoutes.post('/logout',logoutUser);
sessionRoutes.post('/restore-password',restorePassword)
sessionRoutes.get('/github', githubLogin)
sessionRoutes.get('/githubcallback', githubCallback, githubCallbackHandler)

export default sessionRoutes;