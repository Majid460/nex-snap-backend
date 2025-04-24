// src/auth/routes/auth.routes.js
import express from 'express';
import controller from '../controller/controller.js';

const authRoutes = express.Router();

authRoutes.post('/signup', controller.signup);
authRoutes.post('/login', controller.login);

export default authRoutes;
