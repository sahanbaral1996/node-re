"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = __importDefault(require("body-parser"));
const body_parser_xml_1 = __importDefault(require("body-parser-xml"));
body_parser_xml_1.default(body_parser_1.default);
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const api_1 = __importDefault(require("api"));
const config_1 = __importDefault(require("config"));
const logger_1 = require("./logger");
const webhooks_1 = __importDefault(require("webhooks"));
const errorHandlers_1 = __importDefault(require("api/middlewares/errorHandlers"));
const celebrate_1 = require("celebrate");
exports.default = ({ app }) => {
    app.use(logger_1.requestLogger());
    const Sentry = logger_1.sentryLogger({ app });
    // RequestHandler creates a separate execution context using domains, so that every
    // transaction/span/breadcrumb is attached to its own Hub instance
    app.use(Sentry.Handlers.requestHandler());
    // TracingHandler creates a trace for every incoming request
    app.use(Sentry.Handlers.tracingHandler());
    /**
     * Health Check endpoints
     */
    app.get('/status', (req, res) => {
        return res.status(200).json({ success: true });
    });
    app.head('/status', (req, res) => {
        return res.status(200).end();
    });
    app.use(helmet_1.default());
    // The magic package that prevents frontend developers going nuts
    // Alternate description:
    // Enable Cross Origin Resource Sharing to all origins by default
    app.use(cors_1.default());
    // Middleware that transforms the raw string of req.body into json
    app.use(body_parser_1.default.json());
    app.use(body_parser_1.default.xml());
    // Load API routes
    app.use(config_1.default.api.prefix, api_1.default());
    app.use(config_1.default.webhook.prefix, webhooks_1.default());
    // The error handler must be before any other error middleware and after all controllers
    app.use(Sentry.Handlers.errorHandler());
    // celebrate error handling
    app.use(celebrate_1.errors());
    /// error handlers
    app.use(errorHandlers_1.default);
};
