import * as express from "express";
import {ExpressRouter} from "./ExpressRouter";

export class ExpressApplication{

    private application: express.Application;
    private registeredRoutes: Array<string>;

    constructor() {
        this.application = express();
        this.registeredRoutes = [];
    }

    async onDeploy():Promise<any>{
        return;
    }

    public deployRoute(path: string, route: ExpressRouter):boolean{
        try {
            this.application.use(path, route.getExpressRouter());
            this.registeredRoutes.push(path);
            return true;
        } catch (exception) {
            throw new Error("Failed injecting route");
        }
    }

    set(setting: string, val: any){
        this.application.set(setting, val);
    }

    use(path: string, router?: ExpressRouter){
        if (router)
            this.application.use(<any>path, router.getExpressRouter());
        else
            this.application.use(<any>path);
    }

    getApplication(): express.Application{
        return this.application;
    }

}