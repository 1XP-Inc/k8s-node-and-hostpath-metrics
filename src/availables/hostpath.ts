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

    protected readonly usedKiloBytesGauge = new Gauge({
        name: `${this.metricPrefix}_used_kilo_bytes`,
        help: 'Used bytes of mount',
        labelNames: ['storage_class', 'mount', 'filesystem']
    });

    protected readonly capacityKiloBytesGauge = new Gauge({
        name: `${this.metricPrefix}_capacity_kilo_bytes`,
        help: 'Capacity bytes of mount',
        labelNames: ['storage_class', 'mount', 'filesystem']
    });

    protected readonly availableKiloBytesGauge = new Gauge({
        name: `${this.metricPrefix}_available_kilo_bytes`,
        help: 'Available bytes of mount',
        labelNames: ['storage_class', 'mount', 'filesystem']
    });


    public constructor(protected readonly mount: string) {
        super(mount);

        this.registry.registerMetric(this.usedKiloBytesGauge);
        this.registry.registerMetric(this.capacityKiloBytesGauge);
        this.registry.registerMetric(this.availableKiloBytesGauge);
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
                this.capacityKiloBytesGauge.labels(this.storageClass, mountInfo.mount, mountInfo.filesystem).set(mountInfo.size);
                this.usedKiloBytesGauge.labels(this.storageClass, mountInfo.mount, mountInfo.filesystem).set(mountInfo.used);
                this.availableKiloBytesGauge.labels(this.storageClass, mountInfo.mount, mountInfo.filesystem).set(mountInfo.available);
            });

        });

    }
}

