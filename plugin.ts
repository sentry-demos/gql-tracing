import { ApolloServerPlugin } from "apollo-server-plugin-base";
//plugin GraphQL request lifecycle
import { Context } from "./context";

const plugin: ApolloServerPlugin<Context> = {
  requestDidStart({ request, context }) {
    if (!!request.operationName) {
      context.transaction.setName(request.operationName!);
    }
    return {
      willSendResponse({ context }) {
        context.transaction.finish();
      },
      executionDidStart() {
        return {
          willResolveField({ context, info }) {
            const span = context.transaction.startChild({
              op: "resolver",
              description: `${info.parentType.name}.${info.fieldName}`,
            });
            return () => {
              span.finish();
            };
          },
        };
      },
    };
  },
};
export default plugin;
