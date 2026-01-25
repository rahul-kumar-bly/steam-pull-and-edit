import NodeCache from "node-cache";
export const cache = new NodeCache({stdTTL:30});

// will implement more features on production, keeping it basic but disabled