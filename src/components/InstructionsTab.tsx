import { BookOpen, Key, Lightbulb, Download, Box, ChevronRight } from 'lucide-react';

interface InstructionsTabProps {}

const sections = [
  {
    icon: BookOpen,
    title: 'How to Use ProtoForge',
    content: `ProtoForge is your AI-powered product prototyping assistant. Here's how to get started:

1. **Select an AI Provider** - Choose from OpenAI, Anthropic, Google, Ollama, or others when prompted.

2. **Enter Your API Key** - Your key stays local in your browser. It's never sent to any server except directly to the AI provider.

3. **Describe Your Product** - Tell the AI about any product you want to build:
   • Hardware devices (robots, IoT sensors, gadgets)
   • Software applications (websites, mobile apps, APIs)
   • Hybrid products (smart devices with apps)

4. **Get Generated Assets** - The AI will create:
   • Complete project code
   • Circuit diagrams (for hardware)
   • Architecture diagrams (for software)
   • 3D models (for physical products)

5. **Download & Build** - Download individual files or a complete ZIP archive.`,
  },
  {
    icon: Key,
    title: 'Setting Up Your AI Provider',
    content: `**Getting an API Key:**

• **OpenAI**: Visit platform.openai.com/api-keys
• **Anthropic**: Go to console.anthropic.com/settings/keys
• **Google AI**: Get a key at aistudio.google.com/app/apikey
• **Ollama**: Run locally - no key needed!
• **DeepSeek**: Sign up at platform.deepseek.com

**Security Note:**
Your API key is stored in your browser's localStorage. It never leaves your device except when making direct API calls to the provider. ProtoForge does not store or log your keys.`,
  },
  {
    icon: Lightbulb,
    title: 'Writing Good Prompts',
    content: `**Tips for Better Results:**

1. **Be Specific** - "Create a smart home temperature sensor with WiFi" is better than "make a temperature device"

2. **Include Requirements**:
   • What it does
   • Who it's for
   • Key features needed
   • Any specific technologies

3. **For Hardware**:
   • "Design an Arduino-based weather station with LCD display"
   • "Create a Bluetooth speaker with rechargeable battery"

4. **For Software**:
   • "Build a React todo app with local storage"
   • "Create a REST API for a task manager with authentication"

5. **For Hybrid**:
   • "Design a fitness tracker with a mobile app and cloud sync"`,
  },
  {
    icon: Download,
    title: 'Downloading Your Files',
    content: `**Download Options:**

1. **Individual Files**:
   • Click any file in the sidebar to preview
   • Use the download icon to save that file

2. **All Files (ZIP)**:
   • Click "Download All" button in the sidebar
   • Gets all generated files in one archive

3. **File Types**:
   • Code files (.js, .ts, .py, etc.)
   • Diagrams (SVG format)
   • Documentation (Markdown)
   • 3D models (JSON data)

**Extracting the ZIP:**
Simply unzip the downloaded file to get all your project files ready to use.`,
  },
  {
    icon: Box,
    title: 'Viewing 3D Models',
    content: `**3D Model Features:**

• **Rotate**: Click and drag to rotate the model
• **Zoom**: Scroll wheel to zoom in/out
• **Auto-rotate**: Models gently float and rotate automatically
• **Lighting**: Professional studio lighting applied

**Supported Product Types:**
The AI generates appropriate 3D models for:
• Robots and drones
• Consumer electronics (phones, laptops, speakers)
• Wearables (smartwatches)
• IoT devices
• Vehicles
• Custom prototypes

**Tip:** For the best 3D preview, describe physical/hardware products specifically.`,
  },
];

export function InstructionsTab({}: InstructionsTabProps) {
  const [expandedSection, setExpandedSection] = useState<number | null>(0);

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-dark-700">
        <h3 className="font-semibold text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary-500" />
          Help & Guide
        </h3>
        <p className="text-sm text-dark-400 mt-1">
          Everything you need to know about ProtoForge
        </p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {sections.map((section, index) => {
          const Icon = section.icon;
          const isExpanded = expandedSection === index;

          return (
            <div key={index} className="border-b border-dark-700/50">
              <button
                onClick={() => setExpandedSection(isExpanded ? null : index)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-dark-700/30 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-primary-500/20 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-primary-400" />
                </div>
                <span className="flex-1 font-medium text-dark-200">{section.title}</span>
                <ChevronRight 
                  className={`w-5 h-5 text-dark-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} 
                />
              </button>
              
              {isExpanded && (
                <div className="px-4 pb-4 pt-1">
                  <div className="pl-11">
                    <pre className="text-sm text-dark-300 whitespace-pre-wrap font-sans leading-relaxed">
                      {section.content}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Quick Tips */}
      <div className="p-4 border-t border-dark-700 bg-dark-800/50">
        <h4 className="text-sm font-medium text-dark-300 mb-2">💡 Quick Tips</h4>
        <ul className="text-xs text-dark-400 space-y-1">
          <li>• Be specific in your product descriptions</li>
          <li>• Include target users and key features</li>
          <li>• Mention specific technologies when needed</li>
          <li>• Download ZIP for complete project</li>
        </ul>
      </div>
    </div>
  );
}
