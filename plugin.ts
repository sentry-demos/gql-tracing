import { ApolloServerPlugin } from "apollo-server-plugin-base";
//plugin GraphQL request lifecycle
import { Context } from "./context";

const plugin: ApolloServerPlugin<Context> = {
//community inspiration: https://gist.github.com/efueyo/eec3aa5115ea63005e92337f3205ccdb#file-sentry-plugin-ts
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
