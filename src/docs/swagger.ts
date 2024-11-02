import swaggerJSDoc from "swagger-jsdoc";

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "OrgaMinder API Documentation",
            version: "1.0.0",
            description: "API documentation for OrgaMinder backend.",
        },
    },
    apis: ["src/routes/*.ts", "src/interfaces/*.ts"],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
