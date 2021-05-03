"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const plugin = {
    requestDidStart({ request, context }) {
        if (!!request.operationName) {
            context.transaction.setName(request.operationName);
            //telling compiler that this is indeed non null and non undefined
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
                            description: `${info.parentType.name}.${info.fieldName}`
                        });
                        return () => {
                            span.finish();
                        };
                    }
                };
            }
        };
    }
};
exports.default = plugin;
//# sourceMappingURL=plugin.js.map