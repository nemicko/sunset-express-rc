import *  as express from "express";

import {HttpServer} from "./HttpServer";
import {ExpressApplication} from "./ExpressApplication";

export class Sunset{

    private readonly httpServer: HttpServer;
    private readonly port: number;

    private application: express.Application;
    private deployedApplications: Array<string>;

    constructor(port: number){
        this.port = port;
        this.deployedApplications = [];
        this.httpServer = new HttpServer();
    }

    public startup(){
        this.application = express();

        this.httpServer.bootstrap(this, this.port);
        return true;
    }

    public deployApplication(path: string, app: ExpressApplication):boolean{
        if (this.deployedApplications.indexOf(path) != -1){
            throw new Error("URL path already used");
        }
        try {
            this.application.use(path, app.getApplication());
            return true;
        } catch (exception) {
            throw new Error("Failed injecting route");
        }
    }

    public use(any):any{
        this.application.use(any);
    }

    public getApplication():express.Application{
        return this.application;
    }

    public getHttpServer():HttpServer{
        return this.httpServer;
    }

    public terminate():boolean{
        return this.httpServer.terminate();
    }

}
