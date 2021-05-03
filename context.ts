import { Transaction } from "@sentry/types";
const Sentry = require("@sentry/node");

export interface Context {
  transaction: Transaction;
}

export async function createContext({
  req,
  connection,
}: {
  req: any;
  connection: any;
}): Promise<Context> {
  const transaction = Sentry.startTransaction({
    op: "gql",
    name: "DefaultGraphQLTransaction",
  });

  return { transaction };
}
