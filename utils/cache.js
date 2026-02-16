// import NodeCache from "node-cache";
// export const cache = new NodeCache({stdTTL:30});

// will implement more features on production, keeping it basic but disabled


import redis from 'redis';
const client = redis.createClient();

client.on('error', (err) => {
    console.log('Redis Client Error', err);
});

await client.connect();

export default client;