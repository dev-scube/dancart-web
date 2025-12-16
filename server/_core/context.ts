import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { sdk } from "./sdk";
import * as db from "../db";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;

  try {
    user = await sdk.authenticateRequest(opts.req);
  } catch (error) {
    // Authentication is optional for public procedures.
    user = null;
  }

  // Modo desenvolvimento: permite usar cookie dev-admin para autenticar como admin
  if (!user && process.env.NODE_ENV === "development") {
    const devAdmin = opts.req.cookies?.["dev-admin"];
    if (devAdmin === "true") {
      try {
        const adminUser = await db.getUserByOpenId("admin-dev");
        if (adminUser) {
          user = adminUser;
        }
      } catch (error) {
        console.error("[Dev Auth] Erro ao buscar usuário admin:", error);
      }
    }
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
