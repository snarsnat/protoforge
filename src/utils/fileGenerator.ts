import { GeneratedFile } from '../types';

export function generateProjectFiles(description: string): GeneratedFile[] {
  const files: GeneratedFile[] = [];
  const desc = description.toLowerCase();
  
  // Determine project type
  const isWeb = desc.includes('web') || desc.includes('website') || desc.includes('app');
  const isHardware = desc.includes('hardware') || desc.includes('circuit') || desc.includes('arduino') || desc.includes('raspberry');
  const isMobile = desc.includes('mobile') || desc.includes('ios') || desc.includes('android');
  const isAPI = desc.includes('api') || desc.includes('backend') || desc.includes('server');
  
  if (isWeb || (!isHardware && !isMobile && !isAPI)) {
    files.push(...generateWebProject(description));
  }
  
  if (isHardware) {
    files.push(...generateHardwareProject(description));
  }
  
  if (isMobile) {
    files.push(...generateMobileProject(description));
  }
  
  if (isAPI) {
    files.push(...generateAPIProject(description));
  }
  
  // Always add a README
  files.push(generateReadme(description, files));
  
  return files;
}

function generateWebProject(description: string): GeneratedFile[] {
  return [
    {
      id: Date.now().toString() + '1',
      name: 'index.html',
      type: 'code',
      language: 'html',
      content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Project</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div id="app">
        <header>
            <h1>${description.substring(0, 30)}</h1>
        </header>
        <main>
            <div class="content">
                <!-- Your content here -->
            </div>
        </main>
    </div>
    <script src="app.js"></script>
</body>
</html>`,
    },
    {
      id: Date.now().toString() + '2',
      name: 'styles.css',
      type: 'code',
      language: 'css',
      content: `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: #0f172a;
    color: #f8fafc;
    min-height: 100vh;
}

#app {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
}

header {
    text-align: center;
    margin-bottom: 2rem;
}

header h1 {
    font-size: 2.5rem;
    background: linear-gradient(135deg, #0ea5e9, #3b82f6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.content {
    background: #1e293b;
    border-radius: 1rem;
    padding: 2rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
}`,
    },
    {
      id: Date.now().toString() + '3',
      name: 'app.js',
      type: 'code',
      language: 'javascript',
      content: `// Main application logic
document.addEventListener('DOMContentLoaded', () => {
    console.log('App initialized');
    
    // Add your application logic here
    const app = {
        init: () => {
            app.setupEventListeners();
        },
        
        setupEventListeners: () => {
            // Set up click handlers, forms, etc.
        },
        
        // Add more methods as needed
    };
    
    app.init();
});`,
    },
    {
      id: Date.now().toString() + '4',
      name: 'package.json',
      type: 'code',
      language: 'json',
      content: `{
  "name": "my-project",
  "version": "1.0.0",
  "description": "${description.substring(0, 100)}",
  "main": "app.js",
  "scripts": {
    "start": "npx serve .",
    "dev": "npx serve . --port 3000"
  },
  "keywords": [],
  "author": "",
  "license": "MIT"
}`,
    },
  ];
}

function generateHardwareProject(description: string): GeneratedFile[] {
  return [
    {
      id: Date.now().toString() + '1',
      name: 'main.ino',
      type: 'code',
      language: 'cpp',
      content: `// Arduino main code for: ${description.substring(0, 50)}
#include <Arduino.h>

// Pin definitions
const int LED_PIN = 13;
const int BUTTON_PIN = 2;

// Variables
bool ledState = false;

void setup() {
    pinMode(LED_PIN, OUTPUT);
    pinMode(BUTTON_PIN, INPUT_PULLUP);
    
    Serial.begin(9600);
    Serial.println("System initialized");
}

void loop() {
    // Read button state
    if (digitalRead(BUTTON_PIN) == LOW) {
        ledState = !ledState;
        digitalWrite(LED_PIN, ledState ? HIGH : LOW);
        delay(50); // Debounce
    }
    
    // Add your logic here
    
    delay(10);
}`,
    },
    {
      id: Date.now().toString() + '2',
      name: 'circuit.json',
      type: 'diagram',
      content: JSON.stringify({
        components: [
          { type: 'Arduino', pins: ['VCC', 'GND', 'D13', 'D2'] },
          { type: 'LED', pins: [' anode', 'cathode'] },
          { type: 'Resistor', value: '220Ω' },
          { type: 'Button', pins: ['NO', 'NC', 'COM'] },
        ],
        connections: [
          { from: 'Arduino.D13', to: 'LED.anode' },
          { from: 'LED.cathode', to: 'Resistor.pin1' },
          { from: 'Resistor.pin2', to: 'Arduino.GND' },
          { from: 'Arduino.D2', to: 'Button.COM' },
          { from: 'Button.NO', to: 'Arduino.VCC' },
        ],
      }, null, 2),
    },
    {
      id: Date.now().toString() + '3',
      name: 'README.md',
      type: 'text',
      content: `# Hardware Project

## Components Needed
- Arduino Uno or compatible
- LED (any color)
- 220Ω Resistor
- Push Button
- Jumper wires

## Circuit Diagram
See circuit.json for detailed connections.

## How to Use
1. Upload main.ino to your Arduino
2. Connect components as shown
3. Press button to toggle LED`,
    },
  ];
}

function generateMobileProject(description: string): GeneratedFile[] {
  return [
    {
      id: Date.now().toString() + '1',
      name: 'App.tsx',
      type: 'code',
      language: 'typescript',
      content: `import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function App() {
  const [count, setCount] = React.useState(0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>${description.substring(0, 30)}</Text>
      <Text style={styles.counter}>{count}</Text>
      <TouchableOpacity 
        style={styles.button}
        onPress={() => setCount(count + 1)}
      >
        <Text style={styles.buttonText}>Increment</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f172a',
  },
  title: {
    fontSize: 24,
    color: '#f8fafc',
    marginBottom: 20,
  },
  counter: {
    fontSize: 48,
    color: '#0ea5e9',
    fontWeight: 'bold',
  },
  button: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#3b82f6',
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});`,
    },
    {
      id: Date.now().toString() + '2',
      name: 'package.json',
      type: 'code',
      language: 'json',
      content: `{
  "name": "mobile-app",
  "version": "1.0.0",
  "main": "expo/AppEntry.js",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios"
  },
  "dependencies": {
    "expo": "~50.0.0",
    "react": "18.2.0",
    "react-native": "0.73.0"
  }
}`,
    },
  ];
}

function generateAPIProject(description: string): GeneratedFile[] {
  return [
    {
      id: Date.now().toString() + '1',
      name: 'server.js',
      type: 'code',
      language: 'javascript',
      content: `const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Routes
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Add your routes here

app.listen(PORT, () => {
    console.log(\`Server running on port \${PORT}\`);
});`,
    },
    {
      id: Date.now().toString() + '2',
      name: 'package.json',
      type: 'code',
      language: 'json',
      content: `{
  "name": "api-server",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.0"
  }
}`,
    },
    {
      id: Date.now().toString() + '3',
      name: 'routes.yaml',
      type: 'code',
      language: 'yaml',
      content: `openapi: 3.0.0
info:
  title: ${description.substring(0, 30)}
  version: 1.0.0

paths:
  /api/health:
    get:
      summary: Health check
      responses:
        '200':
          description: OK`,
    },
  ];
}

function generateReadme(description: string, files: GeneratedFile[]): GeneratedFile {
  const fileList = files.map(f => `- \`${f.name}\``).join('\n');
  
  return {
    id: Date.now().toString() + 'readme',
    name: 'README.md',
    type: 'text',
    content: `# ${description.substring(0, 50)}

## Description
${description}

## Files
${fileList}

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation
\`\`\`bash
# Install dependencies
npm install

# Start the project
npm start
\`\`\`

## Usage
Describe how to use your project here.

## License
MIT
`,
  };
}
