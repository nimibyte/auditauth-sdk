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
      'x-auditauth-app': appId,
      'x-auditauth-key': apiKey,
    },
    body: JSON.stringify({ ...payload }),
  });
};

export default sendMetrics;
