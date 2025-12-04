
rate(container_cpu_usage_seconds_total[30s]) * 100
Instead of raw CPU seconds:

rate(container_cpu_usage_seconds_total[30s]) * 100


Prometheus is a time-series database.

You run it as a container.

Grafana doesn’t store metrics.
It queries Prometheus and creates dashboards.







Memory

container_memory_usage_bytes


Network

rate(container_network_receive_bytes_total[1m])


sum by(container)(
  label_replace(
    rate(container_cpu_usage_seconds_total[30s]),
    "container",
    "$1",
    "id",
    ".*/(.*)"
  ) * 100
)

http://localhost:9095/targets
docker stats
