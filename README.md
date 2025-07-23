# Moti Hub Bot

A motivational Telegram bot that provides inspirational quotes and interacts with users through a simple and intuitive interface.

## Features

- Random motivational quotes
- Quote search by author
- Interactive buttons and keyboard
- Author information
- Webhook-based setup for reliable performance

## Installation

1. Clone this repository:
```bash
git clone <repository-url>
cd telegram-bot
```

2. Install dependencies:
```bash
npm install
```

3. Copy the example environment file and fill in your values:
```bash
cp .env.example .env
```

## Environment Setup

Configure the following environment variables in your `.env` file:

- `BOT_TOKEN`: Your Telegram Bot Token (get it from @BotFather)
- `WEBHOOK_URL`: The URL where your bot will receive updates
- `PORT`: The port on which your server will run (default: 3000)
- `INSPIRE_API`: The API endpoint for fetching inspirational quotes

## Usage

Start the development server:

```bash
npm run dev
```

The bot will be available on Telegram and will respond to commands and messages.

## Bot Commands

- `/start` - Initialize the bot and get a welcome message
- `/help` - Display available commands
- `/random_quote` - Get a random inspirational quote
- `/quit` - Stop the bot interaction

## Keyboard Commands

- `Random Quote` - Get a random quote
- `Choose Author` - Select an author to get their quotes
- `About [Author]` - Learn about a specific author
- `One More Quote by [Author]` - Get another quote from the selected author
- `Quit` - End the current session

## Project Structure

```
telegram-bot/
├── config/              # Configuration files
├── src/                 # Source code
│   ├── bot/             # Bot-specific logic
│   │   ├── actions.ts   # Bot action handlers
│   │   └── commands.ts  # Bot command handlers
│   ├── index.ts         # Application entry point
│   ├── smallTalk.ts     # Conversational handlers
│   ├── utils.ts         # Utility functions
│   └── webhook.ts       # Webhook setup
├── types/               # TypeScript type definitions
├── .env.example         # Example environment variables
├── package.json         # Project dependencies
└── tsconfig.json        # TypeScript configuration
```

## Dependencies

- [Telegraf](https://telegraf.js.org/) - Modern Telegram bot framework
- Express - Web server for handling webhook requests
- Axios - HTTP client for API requests
- TypeScript - For type safety
- dotenv - For environment variable management
