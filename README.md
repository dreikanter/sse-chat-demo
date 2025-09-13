# SSE Chat Application

A simple Server-Sent Events (SSE) based chat application using Angular frontend and Node.js backend.

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Build the Angular app:**
   ```bash
   npm run build
   ```

3. **Start the server:**
   ```bash
   npm start
   ```

4. **Open the chat:**
   - Open your browser to `http://localhost:3000`
   - Open multiple browser windows/tabs to test chat between users
   - Each user gets a random username that can be changed

## How it works

- **Backend**: Simple Express.js server with SSE endpoint (`/events`) and message posting endpoint (`/message`)
- **Frontend**: Angular application with real-time message display using EventSource API
- **Real-time**: Server broadcasts messages to all connected clients instantly
- **No state**: Server doesn't store messages, only broadcasts them to active connections

## Features

- Random username generation
- Real-time message broadcasting
- Connection status indicator
- Simple, responsive UI
- No database required
- Zero configuration needed

## Development

To run in development mode:

```bash
# Terminal 1 - Start Angular dev server
npm run dev

# Terminal 2 - Start Node.js server
npm start
```

Then open `http://localhost:4200` for development with hot reload.