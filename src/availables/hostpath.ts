import TargetAbstract from "../target.abstract";
import {Gauge, Registry} from 'prom-client';
import * as _df from 'node-df';

export default class Hostpath extends TargetAbstract {

    protected readonly df = (options: {}) => {
        return new Promise((resolve, reject) => {
            _df(options, (error: any, response: any) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(response);
                }
            });
        });
    };

    protected readonly metricPrefix = 'microk8s_volume';
    protected readonly storageClass = 'hostpath'

    protected readonly registry = new Registry();

    protected readonly usedMegaBytesGauge = new Gauge({
        name: `${this.metricPrefix}_used_mega_bytes`,
        help: 'Used bytes of mount',
        labelNames: ['storage_class', 'mount', 'filesystem']
    });

    protected readonly capacityMegaBytesGauge = new Gauge({
        name: `${this.metricPrefix}_capacity_mega_bytes`,
        help: 'Capacity bytes of mount',
        labelNames: ['storage_class', 'mount', 'filesystem']
    });


    public constructor(protected readonly mount: string) {
        super(mount);

        this.registry.registerMetric(this.usedMegaBytesGauge);
        this.registry.registerMetric(this.capacityMegaBytesGauge);
    }

    public async makeMetrics(): Promise<string> {
        let customMetrics = '';
        try {
            await Promise.all([
                await this.updateVolumeBytes(this.mount),
            ]);

            customMetrics = await this.registry.metrics();

        } catch (e) {
            console.error('makeMetrics', e);
        }

        return customMetrics;
    }

    protected async updateVolumeBytes(mount: string): Promise<void> {

        return await this.df({prefixMultiplier: 'KiB', precision: 0}).then((response: any) => {
            response.filter((item: any) => {
                return mount.split(',').includes(item.mount)
            }).forEach((mountInfo: any) => {
                this.usedMegaBytesGauge.labels(this.storageClass, mountInfo.mount, mountInfo.filesystem).set(mountInfo.used);
                this.capacityMegaBytesGauge.labels(this.storageClass, mountInfo.mount, mountInfo.filesystem).set(mountInfo.size);
            });

        });

    }
}

