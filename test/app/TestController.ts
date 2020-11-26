import * as express from "express";
import {ExpressController, Get, Post, Put, Delete, SyncedPost} from "../../src/ExpressController";

export class TestController extends ExpressController{

    private bufferSync = [];
    private bufferAsync = [];

    constructor(){
        super();

        for(let i=0;i<1000;i++){
            this.bufferSync.push(i);
            this.bufferAsync.push(i);
        }

        this.get("/:param1", this.getRequest);
        this.post("/:param1", this.postRequest);
        this.put("/:param1", this.putRequest);
        this.delete("/:param1", this.deleteRequest);
    }

    private getRequest(req: express.Request, res: express.Response, next: express.NextFunction): void {
        res.send({
            param1: req.params.param1
        });
    }

    private postRequest(req: express.Request, res: express.Response, next: express.NextFunction): void {
        res.send({
            param1: req.params.param1,
            param2: req.body.param2
        });
    }

    private putRequest(req: express.Request, res: express.Response, next: express.NextFunction): void {
        console.log("tes");
        res.send({
            param1: req.params.param1,
            param2: req.body.param2
        });
    }

    private deleteRequest(req: express.Request, res: express.Response, next: express.NextFunction): void {
        res.send({
            param1: req.params.param1
        });
    }

    /**
     * Define get method with decorator
     */
    @Get("/decorated/:param1")
    public getDecorator(req: express.Request, res: express.Response, next: express.NextFunction): void {
        res.send({
            param1: req.params.param1
        });
    }

    /**
     * Define post method with decorator
     */
    @Post("/decorated/:param1")
    public postDecorator(req: express.Request, res: express.Response, next: express.NextFunction): void {
        res.send({
            param1: req.params.param1,
            param2: req.body.param2
        });
    }

    /**
     * Define post method with decorator
     */
    @Put("/decorated/:param1")
    public putDecorator(req: express.Request, res: express.Response, next: express.NextFunction): void {
        res.send({
            param1: req.params.param1,
            param2: req.body.param2
        });
    }

    /**
     * Define post method with decorator
     */
    @Delete("/decorated/:param1")
    public deleteDecorator(req: express.Request, res: express.Response, next: express.NextFunction): void {
        res.send({
            param1: req.params.param1
        });
    }



    /**
     * Post request not synced
     */
    @Post("/async/:index")
    public async asyncPost(req: express.Request, res: express.Response, next: express.NextFunction): Promise<any> {
        // fetch before async
        const value = this.bufferAsync[0];

        // do some async process
        await this.doWait();
        await this.doWait();
        await this.doWait();

        const valueShift = this.bufferAsync.shift();

        // return request
        return res.send({ match: valueShift == value });
    }



    /**
     * Post request synced
     */
    @SyncedPost("/synced/:index", 15)
    public async syncedPostTest(req: express.Request, res: express.Response, next: express.NextFunction): Promise<any> {
        const value = this.bufferSync[0];

        // do some async process
        await this.doWait();
        await this.doWait();
        await this.doWait();

        const valueShift = this.bufferSync.shift();

        return res.send({ match: valueShift == value });
    }

    doWait(): Promise<any> {
        return new Promise((resolve) => {
            setTimeout(resolve, 100);
        });
    }

}
