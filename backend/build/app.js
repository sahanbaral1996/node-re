"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const loaders_1 = __importDefault(require("loaders"));
const container_1 = __importDefault(require("container"));
const logger_1 = __importDefault(require("./loaders/logger"));
const config_1 = __importDefault(require("config"));
async function startServer() {
    const app = express_1.default();
    await loaders_1.default({ expressApp: app });
    const { salesforceConnection } = container_1.default.cradle;
    // TODO: Remove when dependent modules use container
    app.locals.sfConn = salesforceConnection;
    return app
        .listen(config_1.default.port, () => {
        logger_1.default.info(`
      ################################################
      🛡️  Server listening on port: ${config_1.default.port} 🛡️
      ################################################
    `);
    })
        .on('error', err => {
        logger_1.default.error(err);
        process.exit(1);
    });
}
exports.default = startServer();
