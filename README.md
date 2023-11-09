# microk8s volume metrics

Extra metrics for microk8s volume.

## Metrics

- **microk8s_volume_used_mega_bytes** - Used MegaBytes of mount
- **microk8s_volume_capacity_mega_bytes** - Capacity MegaBytes of mount

## ENV

| Variable Name             | Description                                                           | Example                    |
|---------------------------|-----------------------------------------------------------------------|----------------------------|
| `PORT`                    | Exporter listening Port                                               | `27770`                    |
| `MOUNT`                   | Mount name to monitor                                                 | `/etc/hosts`               |
| `STORAGE_CLASS(Optional)` | The name of the storage class to be used in  `./availables` directory | `./availables/hostpath.ts` |
