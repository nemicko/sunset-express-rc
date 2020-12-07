import {IExtendedRequest} from "./IExtendedRequest";
import * as express from "express";
import events = require('events');

/**
 * Force Synchronized Request processing
 */
export class SyncedRequestHandler {

    private syncedBuffer: Array<any>;
    private syncedBufferProcess: boolean;
    private exceptionsCount: number = 0;

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

    private counter = 0;

    private proccessSyncedPost(handler) {
        if (this.syncedBufferProcess)
            return;

        // process request
        this.syncedBufferProcess = true;
        const request = this.syncedBuffer.shift();
        handler(request.req, request.res, request.next)
            .then(success => {})
            .catch(exception => {
                // pass on internal exception
                if (request.res.destroyed){
                    request.req.destroy();
                } else {
                    request.res.status(500).send();
                }
                throw exception;
            })
            .finally(() => {
                this.syncedBufferProcess = false;

                // update response (object) with bufferState
                request.res.syncedBuffer = this.syncedBuffer.length;

                // check if more requests in buffer and continue
                if (this.syncedBuffer.length > 0)
                    this.proccessSyncedPost(handler);
            });
    };

    private intermediateHandler(req: IExtendedRequest, res: express.Response, next: express.NextFunction) {
        if (this.syncedBuffer.length > this.bufferSize){
            // @ts-ignore
            res.syncedRejection = true;
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
