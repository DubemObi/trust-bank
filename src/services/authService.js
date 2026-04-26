import { authApi, tokenStore } from "../lib/endpoints";

export const login = async (email, password) => {
  const res = await authApi.login({ email, password });

  tokenStore.set(res.token); // store JWT
  return res;
};