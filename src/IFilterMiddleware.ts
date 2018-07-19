import * as express from "express";

export interface IFilterMiddleware{

    apply(req: express.Request, res: express.Response, next: express.NextFunction): any;

}