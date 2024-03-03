# WOL-Discord

WOL-Discord is a TypeScript Discord bot that allows for waking up devices using
[Wake-On-Lan](https://en.wikipedia.org/wiki/Wake-on-LAN) (WOL)

## Setup

Install dependencies

```bash
npm install
# or
pnpm install
```

Create a new file called .env and add a Discord bot token

```dosini
DISCORD_BOT_TOKEN=YOUR_DISCORD_BOT_TOKEN
```

Configure the device settings in ./src/devices.json

```
{
    "list": [
        {
            "id": "1",
            "name": "Desktop",
            "network": {
                "macAddress": "00:00:00:00:00:00",
                "ipAddress": "192.168.1.2"
            },
            "permittedUsers": [
                {
                    "id": "308994132968210433",
                    "permissions": {
                        "wol": true,
                        "ping": true
                    }
                }
            ]
        }
    ]
}
```

Build and run

```bash
npm run build:start
# or
npm run build
npm run start
```
