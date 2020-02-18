import nodeSpAuth from "node-sp-auth";
import NodeCache from "node-cache";

const localCache = new NodeCache();

export default async () => {
  const token = localCache.get("token");
  if (token) {
    return token;
  }
  const response = await nodeSpAuth.getAuth(process.env.TENANT, {
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  let {
    headers: { Authorization }
  } = response || { headers: {} };
  if (Authorization) {
    localCache.set("token", Authorization, 20000);
  }
  return Authorization;
};
