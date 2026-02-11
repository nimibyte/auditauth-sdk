import { CORE_SETTINGS } from "../settings";
import { Metric } from "../types";

type SendMetricsPayload = {
  payload: Metric;
  appId: string;
  apiKey: string;
};

const sendMetrics = async ({ apiKey, appId, payload }: SendMetricsPayload) => {
  await fetch(`${CORE_SETTINGS.domains.api}/metrics`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ...payload, appId, apiKey }),
  });
};

export default sendMetrics;
