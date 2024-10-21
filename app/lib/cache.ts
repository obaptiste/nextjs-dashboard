// app/lib/cache.ts (Separate file to configure cache instance)
import NodeCache from "node-cache";
const cache = new NodeCache({ stdTTL: 300, checkperiod: 320 }); // Cache with 5 mins TTL
export default cache;