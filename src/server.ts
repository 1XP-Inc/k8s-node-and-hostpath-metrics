import * as express from 'express';
import {Express} from 'express';
import * as http from "http";
import * as morgan from 'morgan';
import TargetAbstract from "./target.abstract";

export default class Server {
    private readonly app: Express = express();
    private server: http.Server = undefined;

    public async setup(): Promise<void> {
        this.app.use(morgan('combined'));
        this.app.use('/metrics', await this.getMetricLoader());
    }

    private getMetricLoader(): Promise<express.RequestHandler> {
        console.log('MOUNT', process.env.MOUNT || 'undefined');
        console.log('Storage Class', process.env.STORAGE_CLASS || 'undefined');
        const Cls = require(process.env.STORAGE_CLASS || './availables/hostpath.ts').default;
        const cls: TargetAbstract = new Cls(
            process.env.MOUNT);

        return cls.metrics();
    }

    public async start(): Promise<{ server: http.Server, port: string }> {
        return this.setup().then(() => {
            const port = process.env.PORT || '27770';
            this.server = this.app.listen(port);
            return {server: this.server, port: port};
        });
    }

}