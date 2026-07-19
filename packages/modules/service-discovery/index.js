import { createClient } from 'redis';

const REGISTRY_KEY_PREFIX = 'everyday:service-registry:';
const RESTART_CHANNEL = 'app.fct.servicerestarted';

/**
 * Redis-backed service discovery. Each service registers its own entry
 * (name + base URL + basePath) on boot and publishes a "restarted" event so
 * the gateway can refresh its routing table without a manual config edit —
 * see MONOREPO-ARCHITECTURE-TEMPLATE.md section 4.1 for the rationale.
 */
export const makeServiceDiscovery = ({ redisUrl }) => {
  const client = createClient({ url: redisUrl });
  const subscriber = client.duplicate();

  const connect = async () => {
    if (!client.isOpen) await client.connect();
  };

  const registerService = async ({ serviceName, rootUrl, basePath }) => {
    await connect();
    const entry = { serviceName, rootUrl, basePath, registeredAt: new Date().toISOString() };
    await client.set(`${REGISTRY_KEY_PREFIX}${serviceName}`, JSON.stringify(entry));
    await client.publish(RESTART_CHANNEL, JSON.stringify({ serviceName }));
    return entry;
  };

  const getServiceRegistry = async () => {
    await connect();
    const keys = await client.keys(`${REGISTRY_KEY_PREFIX}*`);
    if (keys.length === 0) return [];
    const values = await client.mGet(keys);
    return values.filter(Boolean).map((v) => JSON.parse(v));
  };

  const onServiceRestarted = async (callback) => {
    if (!subscriber.isOpen) await subscriber.connect();
    await subscriber.subscribe(RESTART_CHANNEL, (message) => {
      callback(JSON.parse(message));
    });
  };

  return { client, registerService, getServiceRegistry, onServiceRestarted };
};
