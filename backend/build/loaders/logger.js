"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sentryCaptureExceptions = exports.sentryCustomLogger = exports.sentryLogger = exports.requestLogger = void 0;
const winston_1 = __importDefault(require("winston"));
const morgan_1 = __importDefault(require("morgan"));
const Sentry = __importStar(require("@sentry/node"));
const Tracing = __importStar(require("@sentry/tracing"));
const config_1 = __importDefault(require("../config"));
const requestLogger = () => {
    if (process.env.NODE_ENV !== 'development') {
        return morgan_1.default('combined');
    }
    else {
        return morgan_1.default('dev');
    }
};
exports.requestLogger = requestLogger;
const transports = [];
if (process.env.NODE_ENV !== 'development') {
    transports.push(new winston_1.default.transports.Console());
}
else {
    transports.push(new winston_1.default.transports.Console({
        format: winston_1.default.format.combine(winston_1.default.format.cli(), winston_1.default.format.splat()),
    }));
}
const LoggerInstance = winston_1.default.createLogger({
    level: config_1.default.logs.level,
    levels: winston_1.default.config.npm.levels,
    format: winston_1.default.format.combine(winston_1.default.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
    }), winston_1.default.format.errors({ stack: true }), winston_1.default.format.splat(), winston_1.default.format.json()),
    transports,
});
const sentryLogger = ({ app }) => {
    Sentry.init({
        dsn: config_1.default.sentry.dsn,
        integrations: [
            // enable HTTP calls tracing
            new Sentry.Integrations.Http({ tracing: true }),
            // enable Express.js middleware tracing
            new Tracing.Integrations.Express({ app }),
        ],
        // Set tracesSampleRate to 1.0 to capture 100%
        // of transactions for performance monitoring.
        // We recommend adjusting this value in production
        tracesSampleRate: 1.0,
    });
    return Sentry;
};
exports.sentryLogger = sentryLogger;
const sentryCustomLogger = (message) => {
    Sentry.captureMessage(message);
};
exports.sentryCustomLogger = sentryCustomLogger;
exports.sentryCaptureExceptions = Sentry.captureException;
exports.default = LoggerInstance;
