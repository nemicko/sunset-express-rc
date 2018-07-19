import {Sunset} from "./Sunset";

const http = require('http');

export class HttpServer{

    private port:number;
    private server: any;

    constructor(){}

    bootstrap(app: Sunset, port:number){

        // set port
        app.getApplication().set('port', port);

        /**
         * Create HTTP server.
         */
        this.server = http.createServer(app.getApplication());

        this.server.listen(port);
        this.server.on('error', function (error) {
            if (error.syscall !== 'listen') {
                throw error;
            }

            let bind = typeof port === 'string'
                ? 'Pipe ' + port
                : 'Port ' + port;

            // handle specific listen errors with friendly messages
            switch (error.code) {
                case 'EACCES':
                    throw new Error("Port requires elevated privileges");
                case 'EADDRINUSE':
                    throw new Error("Port is already in use");
                default:
                    throw error;
            }
        });

        this.server.on('listening', () => {
            let addr = this.server.address();
            let bind = typeof addr === 'string'
                ? 'pipe ' + addr
                : 'port ' + addr.port;
        });

    }

    terminate():boolean{
        return this.server.close();
    }

    public getSocket():any{
        return this.server.getSocket();
    }

    public getServer():any{
        return this.server;
    }

}