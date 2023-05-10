import { Redis } from "@upstash/redis";

export const defaultRedis = new Redis({
  url: process.env.REDIS_URL ?? "https://apn1-decent-bee-34619.upstash.io",
  token: process.env.REDIS_TOKEN ?? "AYc7ACQgNGY1N2YyZGEtMTM1MC00NDg1LTkxNGEtZjdkZDgzNGNiYzAwNzRlMzcwNTRlNDI0NDU5ZDgwNWUzNWE5OTQwOTM1OTU",
});
