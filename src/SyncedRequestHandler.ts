import {IExtendedRequest} from "./IExtendedRequest";
import * as express from "express";

/**
 * Force Synchronized Request processing
 */
export class SyncedRequestHandler {

    private syncedBuffer: Array<any>;
    private syncedBufferProcess: boolean;

    private readonly bufferSize: number;
    private readonly handler: (req: IExtendedRequest, res: express.Response, next: express.NextFunction) => any;

    constructor(bufferSize: number, handler: (req: IExtendedRequest, res: express.Response, next: express.NextFunction) => any) {
        this.handler = handler;
        this.bufferSize = bufferSize;

        this.syncedBuffer = new Array();

        /*
        setInterval(() => {
            console.log(this.syncedBuffer.length);
            this.proccessSyncedPost();
        }, 1000);*/
    }

    public getHandler(){
        return this.intermediateHandler.bind(this);
    }

    private proccessSyncedPost() {
        if (this.syncedBuffer.length == 0 || this.syncedBufferProcess)
            return;

        // process request
        this.syncedBufferProcess = true;
        const request = this.syncedBuffer.shift();

        // check if request still valid
        if (request.res.destroyed){
            request.req.destroy();
            this.syncedBufferProcess = false;
            return this.proccessSyncedPost();
        }

        this.handler(request.req, request.res, request.next)
            .then(success => {})
            .catch(exception => {
                // pass on internal exception
                if (request.res.destroyed){
                    request.req.destroy();
                } else {
                    request.res.status(500).send();
                }
            })
            .finally(() => {
                // update response (object) with bufferState
                request.res.syncedBuffer = this.syncedBuffer.length;

                // enable next process
                this.syncedBufferProcess = false;

                // check if more requests in buffer and continue
                this.proccessSyncedPost();
            });
    };

    private intermediateHandler(req: IExtendedRequest, res: express.Response, next: express.NextFunction) {
        if (this.syncedBuffer.length >= this.bufferSize){
            // @ts-ignore
            res.syncedRejection = true;
            // @ts-ignore
            res.syncedBuffer = this.syncedBuffer.length;
            res.sendStatus(429);
        } else {
            this.syncedBuffer.push({
                req: req,
                res: res,
                next: next,
                timeout: null
            });
            this.proccessSyncedPost();
        }
    }

}
