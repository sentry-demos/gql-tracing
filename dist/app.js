"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const bodyParser = require('body-parser');
const Sentry = require('@sentry/node');
const { ApolloServer } = require('apollo-server-express');
const { gql } = require('graphql-tag');
const { createContext } = require('./context');
const SentryPlugin = require('./plugin');
const port = 3000;
const tools = [
    {
        sku: '32fszdcqdq3rasdfasdf',
        image: 'wrench.png',
        make: 'wrench',
        name: 'super wrench',
        price: 2341
    },
    {
        sku: '12341234tueqweradsf',
        image: 'hammer.png',
        make: 'hammer',
        name: 'poor hammer',
        price: 5134
    },
    {
        sku: '134rwqejfsdkfvzxcv',
        image: 'nails.png',
        make: 'nails',
        name: 'maker nails',
        price: 1234
    }
];
const typeDefs = gql `
    type Query {tools:[Tool]}
    type Tool {sku:String,image:String,make:String,name:String,price:Int}
`;
const resolvers = {
    Query: { tools: () => tools }
};
const server = new ApolloServer({ typeDefs, resolvers, plugins: [SentryPlugin.default], context: ({ req, connection }) => createContext({ req, connection }) });
// server.start();
const app = express();
Sentry.init({
    dsn: "https://3fc501bbbee044b4b64781ab0d9360ae@o87286.ingest.sentry.io/5744593",
    project: 'express-gql',
    debug: true,
    integrations: [
        // enable HTTP calls tracing
        new Sentry.Integrations.Http({ tracing: true }),
        // enable Express.js middleware tracing
        //   new Tracing.Integrations.Express({ app }),
    ],
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
});
server.applyMiddleware({ app });
// The error handler must be before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler());
app.use('/graphql', bodyParser.json());
// app.use('/graphiql',graphiqlExpress({endpointURL:'/graphql'}));
app.listen(port, () => console.log(`🚀 Server ready at http://localhost:3000${server.graphqlPath}`));
/**
 * example POST body {"operationName":"AThirdNamedQuery","query":"query AThirdNamedQuery{tools{sku name price}}"}
 * localhost:3000/graphql
 * https://building.lang.ai/automate-performance-monitoring-in-graphql-19b25c7fa543
 */ 
//# sourceMappingURL=app.js.map