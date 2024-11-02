import { NextFunction, Request, Response, Router } from "express";

const routeHandler = (router: Router, routes: (router: Router) => void) => {
    try {
        routes(router);
    } catch (error) {
        // Não é necessário passar o erro para o middleware aqui,
        // pois ele não pode ser um erro de rota, mas pode ser um erro de configuração
        console.error("Error in route definition:", error);
    }

    // Adiciona o middleware de erro global
    router.use((err: any, req: Request, res: Response, next: NextFunction) => {
        next(err); // Passa o erro para o middleware de erro
    });
};

export default routeHandler;
