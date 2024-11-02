// src/app.ts
import errorMiddleware from "@app/middlewares/errorMiddleware";
import authRoutes from "@app/routes/authRoutes";
import taskRoutes from "@app/routes/taskRoutes";
import Config from "@app/utils/Config";
import cors from "cors";
import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./docs/swagger";
import routeHandler from "./utils/routeHandler";

const app = express();

app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Métodos permitidos
        allowedHeaders: ["Content-Type", "Authorization"], // Cabeçalhos permitidos
    })
);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(express.json());

// Defining the routes
routeHandler(app, (router) => {
    router.use("/api/auth", authRoutes);
    router.use("/api/tasks", taskRoutes);
});

// Error middleware to capture and process request errors
app.use(errorMiddleware);

const PORT = Config.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`);
    console.log(`Swagger docs available at http://localhost:${PORT}/docs`);
});
