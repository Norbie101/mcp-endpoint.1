
# MCP Endpoint for DeepAgent

This repository contains a simple Node.js Express server that serves as an MCP (Machine Control Protocol) endpoint for DeepAgent integration. The server provides endpoints for status checking, file operations, and command execution.

## Features

- Basic authentication for secure access
- Status check endpoint
- File operations (read, write, list, delete)
- Command execution
- Ready for deployment on Render.com

## Prerequisites

- Node.js 18 or higher
- npm (Node Package Manager)
- Git

## Local Development

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd mcp-endpoint
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```

   The server will run on port 3000 by default. You can change this by setting the `PORT` environment variable.

## API Endpoints

### Status Check
- `GET /status`: Returns the current status of the MCP endpoint

### File Operations
- `POST /file/read`: Read a file
  ```json
  {
    "filePath": "/path/to/file"
  }
  ```

- `POST /file/write`: Write or append to a file
  ```json
  {
    "filePath": "/path/to/file",
    "content": "File content",
    "append": false
  }
  ```

- `POST /file/list`: List files in a directory
  ```json
  {
    "directoryPath": "/path/to/directory"
  }
  ```

- `POST /file/delete`: Delete a file
  ```json
  {
    "filePath": "/path/to/file"
  }
  ```

### Command Execution
- `POST /exec`: Execute a command
  ```json
  {
    "command": "ls -la"
  }
  ```

  **Note**: The command execution endpoint is for demonstration purposes only. In a production environment, you should implement proper command sanitization and validation.

## Deployment on Render.com

### Step 1: Create a GitHub Repository

1. Create a new repository on GitHub
2. Push your local repository to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <repository-url>
   git push -u origin main
   ```

### Step 2: Set Up Render.com

1. Create a Render.com account at [render.com](https://render.com)
2. From the Render dashboard, click "New" and select "Web Service"
3. Connect your GitHub account and select the repository
4. Configure the service:
   - Name: `mcp-endpoint` (or your preferred name)
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Add environment variables:
   - `BASIC_AUTH_USERNAME`: `Norbie101` (or your preferred username)
   - `BASIC_AUTH_PASSWORD`: `Uhunoma@80` (or your preferred password)
6. Click "Create Web Service"

Render will automatically deploy your service. Once deployed, you'll get a URL for your MCP endpoint.

## Testing with DeepAgent

To configure DeepAgent to use your MCP endpoint:

1. In your DeepAgent configuration, set the MCP endpoint URL to your Render.com service URL
2. Configure the authentication credentials:
   - Username: `Norbie101` (or your configured username)
   - Password: `Uhunoma@80` (or your configured password)

### Testing with cURL

You can test your endpoints using cURL:

```bash
# Status check
curl -u Norbie101:Uhunoma@80 https://your-render-url.onrender.com/status

# Read a file
curl -X POST -u Norbie101:Uhunoma@80 -H "Content-Type: application/json" -d '{"filePath":"/path/to/file"}' https://your-render-url.onrender.com/file/read

# Execute a command
curl -X POST -u Norbie101:Uhunoma@80 -H "Content-Type: application/json" -d '{"command":"ls -la"}' https://your-render-url.onrender.com/exec
```

## Security Considerations

- The command execution endpoint (`/exec`) allows arbitrary command execution. This is potentially dangerous and should be used with caution.
- In a production environment, consider implementing additional security measures such as:
  - Command whitelisting
  - Input sanitization
  - Rate limiting
  - IP restrictions

## License

This project is licensed under the MIT License - see the LICENSE file for details.
