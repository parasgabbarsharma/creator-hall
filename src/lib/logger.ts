import pino from "pino";
import { getRequestId } from "./request-context";

const isDev = process.env.NODE_ENV !== "production";

export const logger = pino({
  mixin() {
    const reqId = getRequestId();
    return { reqId };
  },
  level: process.env.LOG_LEVEL || "info",
  transport: isDev
    ? {
        target: "pino-pretty",
        options: {
          colorize: true,
          ignore: "pid,hostname",
          translateTime: "SYS:standard",
        },
      }
    : undefined,
  formatters: {
    level: (label: string) => {
      return { level: label.toUpperCase() };
    },
  },
});
