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
    }

    public getHandler(){
        return this.intermediateHandler.bind(this);
    }

    private async proccessSyncedPost(handler) {
        if (this.syncedBufferProcess)
            return;

        // process request
        this.syncedBufferProcess = true;
        const request = this.syncedBuffer.shift();
        await handler(request.req, request.res, request.next);
        this.syncedBufferProcess = false;

        // check if more requests in buffer and continue
        if (this.syncedBuffer.length > 0)
            await this.proccessSyncedPost(handler);
    };

    private intermediateHandler(req: IExtendedRequest, res: express.Response, next: express.NextFunction) {
        if (this.syncedBuffer.length > this.bufferSize){
            return res.sendStatus(429);
        } else {
            this.syncedBuffer.push({
                req: req,
                res: res,
                next: next
            });
            this.proccessSyncedPost(this.handler);
        }
    }

}
