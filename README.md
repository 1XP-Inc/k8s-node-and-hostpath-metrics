# microk8s volume metrics

Extra metrics for microk8s volume.

## Metrics

- **microk8s_volume_capacity_kilo_bytes** - Capacity KiloBytes of mount
- **microk8s_volume_used_kilo_bytes** - Used KiloBytes of mount
- **microk8s_volume_available_kilo_bytes** - Available KiloBytes of mount

## Example
```
# HELP microk8s_volume_used_kilo_bytes Used bytes of mountalhost:27770/metrics
# TYPE microk8s_volume_used_kilo_bytes gauge
microk8s_volume_used_kilo_bytes{storage_class="hostpath",mount="/dev",filesystem="devfs"} 230
microk8s_volume_used_kilo_bytes{storage_class="hostpath",mount="/System/Volumes/Data",filesystem="/dev/disk1s1"} 829760784

# HELP microk8s_volume_capacity_kilo_bytes Capacity bytes of mount
# TYPE microk8s_volume_capacity_kilo_bytes gauge
microk8s_volume_capacity_kilo_bytes{storage_class="hostpath",mount="/dev",filesystem="devfs"} 230
microk8s_volume_capacity_kilo_bytes{storage_class="hostpath",mount="/System/Volumes/Data",filesystem="/dev/disk1s1"} 976797816

# HELP microk8s_volume_available_kilo_bytes Available bytes of mount
# TYPE microk8s_volume_available_kilo_bytes gauge
microk8s_volume_available_kilo_bytes{storage_class="hostpath",mount="/dev",filesystem="devfs"} 0
microk8s_volume_available_kilo_bytes{storage_class="hostpath",mount="/System/Volumes/Data",filesystem="/dev/disk1s1"} 123541772
```

## ENV

| Variable Name             | Description                                                           | Example                    |
|---------------------------|-----------------------------------------------------------------------|----------------------------|
| `PORT`                    | Exporter listening Port                                               | `27770`                    |
| `MOUNT`                   | Mount name to monitor                                                 | `/etc/hosts`               |
| `STORAGE_CLASS(Optional)` | The name of the storage class to be used in  `./availables` directory | `./availables/hostpath.ts` |
