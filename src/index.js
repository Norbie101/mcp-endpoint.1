
const express = require('express');
const basicAuth = require('express-basic-auth');
const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

const app = express();
const PORT = process.env.PORT || 3000;

// Configure basic authentication
const users = {};
users[process.env.BASIC_AUTH_USERNAME || 'Norbie101'] = process.env.BASIC_AUTH_PASSWORD || 'Uhunoma@80';

app.use(express.json());
app.use(basicAuth({
  users,
  challenge: true,
  realm: 'DeepAgent MCP Endpoint',
}));

// Status endpoint
app.get('/status', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    message: 'MCP endpoint is running'
  });
});

// File operations endpoints
app.post('/file/read', async (req, res) => {
  try {
    const { filePath } = req.body;
    
    if (!filePath) {
      return res.status(400).json({ error: 'File path is required' });
    }
    
    const content = await fs.readFile(filePath, 'utf8');
    res.json({ content });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/file/write', async (req, res) => {
  try {
    const { filePath, content, append = false } = req.body;
    
    if (!filePath || content === undefined) {
      return res.status(400).json({ error: 'File path and content are required' });
    }
    
    // Create directory if it doesn't exist
    const directory = path.dirname(filePath);
    await fs.mkdir(directory, { recursive: true });
    
    // Write or append to file
    if (append) {
      await fs.appendFile(filePath, content);
    } else {
      await fs.writeFile(filePath, content);
    }
    
    res.json({ success: true, message: `File ${append ? 'appended' : 'written'} successfully` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/file/list', async (req, res) => {
  try {
    const { directoryPath } = req.body;
    
    if (!directoryPath) {
      return res.status(400).json({ error: 'Directory path is required' });
    }
    
    const files = await fs.readdir(directoryPath);
    
    // Get file stats for each file
    const fileDetails = await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(directoryPath, file);
        const stats = await fs.stat(filePath);
        return {
          name: file,
          path: filePath,
          size: stats.size,
          isDirectory: stats.isDirectory(),
          created: stats.birthtime,
          modified: stats.mtime
        };
      })
    );
    
    res.json({ files: fileDetails });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/file/delete', async (req, res) => {
  try {
    const { filePath } = req.body;
    
    if (!filePath) {
      return res.status(400).json({ error: 'File path is required' });
    }
    
    await fs.unlink(filePath);
    res.json({ success: true, message: 'File deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Command execution endpoint
app.post('/exec', async (req, res) => {
  try {
    const { command } = req.body;
    
    if (!command) {
      return res.status(400).json({ error: 'Command is required' });
    }
    
    // SECURITY WARNING: This is for demonstration purposes only
    // In a production environment, you should sanitize and validate commands
    const { stdout, stderr } = await execPromise(command);
    
    res.json({
      stdout,
      stderr,
      success: !stderr
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      stdout: error.stdout,
      stderr: error.stderr
    });
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'DeepAgent MCP Endpoint',
    endpoints: [
      { path: '/status', method: 'GET', description: 'Check the status of the MCP endpoint' },
      { path: '/file/read', method: 'POST', description: 'Read a file' },
      { path: '/file/write', method: 'POST', description: 'Write or append to a file' },
      { path: '/file/list', method: 'POST', description: 'List files in a directory' },
      { path: '/file/delete', method: 'POST', description: 'Delete a file' },
      { path: '/exec', method: 'POST', description: 'Execute a command' }
    ]
  });
});

app.listen(PORT, () => {
  console.log(`MCP endpoint server running on port ${PORT}`);
});
