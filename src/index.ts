import { config } from 'dotenv'
config()

import { Server } from "@hapi/hapi"
import * as Pino from "hapi-pino"
import { RouteConfig, ServerConfig } from './config'

(async () => {
    const server = new Server({
        host: ServerConfig.host,
        port: ServerConfig.port
    })

    await server.register({
        plugin: Pino,
        options: {
            prettyPrint: ServerConfig.environment === 'development',
            logRequestStart: true,
            logRequestComplete: true,
        }
    })

    server.realm.modifiers.route.prefix =RouteConfig.routePrefix

    server.route({
        method: 'GET',
        path: '/',
        handler: (request, context) => context.response({
            environment: ServerConfig.environment
        })
    })

    await server.start()
})()