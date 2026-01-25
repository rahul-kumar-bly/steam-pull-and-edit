import NodeCache from "node-cache";
export const gameCache = new NodeCache({stdTTL: 3600});


// will implement more features on production, keeping it basic but disabled