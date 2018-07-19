import * as express from "express";
import {ExpressRouter} from "./ExpressRouter";

export class StaticRoute extends ExpressRouter{

    private urlPath:string;
    private path:string;

    constructor(){
        super();
    }

    public setMapping(urlPath:string, path: string){
        this.urlPath = urlPath;
        this.path = path;
        this.router.use(this.urlPath, express.static(this.path));
    }

}