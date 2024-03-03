import pino from 'pino';
import fs from 'fs';
import path from 'path';

const isProduction = process.env.NODE_ENV === 'production';
const logLevel = process.env.LOG_LEVEL || (isProduction ? 'info' : 'debug');

const logDir = 'logs';
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

const fileTransport = pino.transport({
    targets: [
        {
            target: 'pino/file',
            options: {
                destination: path.join(logDir, 'app.log')
            },
            level: logLevel
        },
        {
            target: 'pino-pretty',
            options: {
                destination: path.join(logDir, 'app-pretty.log'),
                colorize: false
            },
            level: 'debug'
        }
    ]
});

const prettyTransport = pino.transport({
    target: 'pino-pretty',
    options: { colorize: true }
});

const logger = pino(
    {
        level: logLevel
    },
    isProduction ? fileTransport : prettyTransport
);

export default logger;
