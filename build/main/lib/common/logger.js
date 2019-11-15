"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
const logger = winston_1.default.createLogger({
    level: 'info',
    format: winston_1.default.format.json(),
    defaultMeta: { service: 'user-service' },
    transports: [
        //
        // - Write to all logs with level `info` and below to `combined.log`
        // - Write all logs error (and below) to `error.log`.
        //
        new winston_1.default.transports.File({ filename: 'error.log', level: 'error' }),
        new winston_1.default.transports.File({ filename: 'combined.log' })
    ]
});
exports.logger = logger;
//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston_1.default.transports.Console({
        format: winston_1.default.format.simple()
    }));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2xpYi9jb21tb24vbG9nZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsc0RBQThCO0FBRTlCLE1BQU0sTUFBTSxHQUFHLGlCQUFPLENBQUMsWUFBWSxDQUFDO0lBQ2xDLEtBQUssRUFBRSxNQUFNO0lBQ2IsTUFBTSxFQUFFLGlCQUFPLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRTtJQUM3QixXQUFXLEVBQUUsRUFBRSxPQUFPLEVBQUUsY0FBYyxFQUFFO0lBQ3hDLFVBQVUsRUFBRTtRQUNWLEVBQUU7UUFDRixvRUFBb0U7UUFDcEUscURBQXFEO1FBQ3JELEVBQUU7UUFDRixJQUFJLGlCQUFPLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxFQUFFLFFBQVEsRUFBRSxXQUFXLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxDQUFDO1FBQ3RFLElBQUksaUJBQU8sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEVBQUUsUUFBUSxFQUFFLGNBQWMsRUFBRSxDQUFDO0tBQzFEO0NBQ0YsQ0FBQyxDQUFDO0FBY00sd0JBQU07QUFaZixFQUFFO0FBQ0Ysd0VBQXdFO0FBQ3hFLGdFQUFnRTtBQUNoRSxFQUFFO0FBQ0YsSUFBSSxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsS0FBSyxZQUFZLEVBQUU7SUFDekMsTUFBTSxDQUFDLEdBQUcsQ0FDUixJQUFJLGlCQUFPLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQztRQUM3QixNQUFNLEVBQUUsaUJBQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFO0tBQ2hDLENBQUMsQ0FDSCxDQUFDO0NBQ0gifQ==