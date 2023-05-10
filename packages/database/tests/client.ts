import { Redis } from "@upstash/redis";
import { InvitationCodeDAL, UserDAL } from "../src";

export const testRedis = new Redis({
  url: "https://apn1-decent-bee-34619.upstash.io",
  token:
    "AYc7ACQgNGY1N2YyZGEtMTM1MC00NDg1LTkxNGEtZjdkZDgzNGNiYzAwNzRlMzcwNTRlNDI0NDU5ZDgwNWUzNWE5OTQwOTM1OTU=",
});

export const testUserDAL = new UserDAL(testRedis);
export const testInvitationCodeDAL = new InvitationCodeDAL(testRedis);
