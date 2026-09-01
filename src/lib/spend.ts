import { CREDIT_COSTS } from "./credits";
import { spendCredits } from "./store";
import type { GenerationKind } from "./types";

export class CreditError extends Error {
  status = 402;
  credits: number;
  cost: number;
  constructor(credits: number, cost: number) {
    super("Not enough credits");
    this.credits = credits;
    this.cost = cost;
  }
}

export async function spend(userId: string, kind: GenerationKind) {
  const cost = CREDIT_COSTS[kind];
  const result = await spendCredits(userId, cost);
  if (!result) {
    throw new Error("User not found");
  }
  if (!result.ok) {
    throw new CreditError(result.credits, cost);
  }
  return { credits: result.credits, cost, user: result.user };
}

export { CREDIT_COSTS };
