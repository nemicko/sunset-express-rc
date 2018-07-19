import *  as express from "express";

import {Express} from "express";
import {HttpServer} from "./HttpServer";
import {ExpressRouter} from "./ExpressRouter";

export class Sunset{

    private httpServer: HttpServer;

    private port: number;

    private application: Express;
    private registeredRoutes: Array<string>;

    constructor(port: number){
        this.port = port;
        this.registeredRoutes = [];
        this.httpServer = new HttpServer();
    }

    public startup(){
        this.application = express();

        this.httpServer.bootstrap(this, this.port);
        return true;
    }

    public terminate():boolean{
        return this.httpServer.terminate();
    }

    public registerRoute(path: string, route: ExpressRouter):boolean{
        if (this.registeredRoutes.indexOf(path) != -1){
            throw new Error("URL path already used");
        }
        try {
            this.application.use(path, route.getExpressRouter());
            return true;
        } catch (exception) {
            throw new Error("Failed injecting route");
        }
    }

    public use(any):any{
        this.application.use(any);
    }

    public getApplication():Express{
        return this.application;
    }

    public getHttpServer():HttpServer{
        return this.httpServer;
    }

}