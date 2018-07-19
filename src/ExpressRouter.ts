import *  as express from "express";
import {ExpressController} from "./ExpressController";

export class ExpressRouter{

    protected router: express.Router;

    constructor(){
        this.router = express.Router();
    }

    public addController(path: string, controller: ExpressController): boolean {
        try {
            this.router.use(path, controller.getExpressRouter());
            return true;
        } catch (exception) {
            throw new Error("Failed injecting controller");
        }
    }

    getExpressRouter():express.Router{
        return this.router;
    }

    public use(path: string | any, method?: (request: any, response: any, next?: () => any) => any):void{
        if (method) {
            this.router.use(path, method);
        } else {
            this.router.use(path);
        }
    }

}