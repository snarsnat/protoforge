import { DiagramData } from '../types';

export function generateDiagram(type: string, description: string): DiagramData {
  const diagramTypes: Record<string, string> = {
    circuit: generateCircuitDiagram(description),
    architecture: generateArchitectureDiagram(description),
    flowchart: generateFlowchart(description),
    uml: generateUMLDiagram(description),
  };

  return {
    type: type as DiagramData['type'],
    content: diagramTypes[type] || diagramTypes.flowchart,
  };
}

function generateCircuitDiagram(description: string): string {
  return `\`\`\`mermaid
circuit
    title ${description.substring(0, 50)}
    
    V1 [Power Source] --> R1
    R1 --> LED1
    LED1 --> GND
    
    subgraph Components
        R1 (Resistor 220Ω)
        LED1 (LED)
    end
\`\`\``;
}

function generateArchitectureDiagram(description: string): string {
  return `\`\`\`mermaid
flowchart TD
    Client[User Client] -->|HTTP| LB[Load Balancer]
    LB -->|Requests| API[API Server]
    API -->|Read/Write| DB[(Database)]
    API -->|Cache| Redis[Redis Cache]
    API -->|Queue| MQ[Message Queue]
    MQ --> Workers[Background Workers]
    Workers -->|Process| External[External Services]
    
    style Client fill:#e1f5fe
    style API fill:#fff3e0
    style DB fill:#e8f5e9
\`\`\``;
}

function generateFlowchart(description: string): string {
  return `\`\`\`mermaid
flowchart TD
    Start([Start]) --> Process1{Input?}
    Process1 -->|Valid| Process2[Process Data]
    Process1 -->|Invalid| Error[Show Error]
    Process2 --> Decision{Success?}
    Decision -->|Yes| Output[Generate Output]
    Decision -->|No| Retry[Retry]
    Retry --> Process1
    Output --> End([End])
    Error --> End
    
    style Start fill:#0ea5e9,color:#fff
    style End fill:#0ea5e9,color:#fff
    style Output fill:#22c55e,color:#fff
\`\`\``;
}

function generateUMLDiagram(description: string): string {
  return `\`\`\`mermaid
classDiagram
    class User {
        +String name
        +String email
        +login()
        +logout()
    }
    
    class Product {
        +String id
        +String name
        +Float price
        +getDetails()
    }
    
    class Order {
        +String id
        +Date created
        +calculateTotal()
    }
    
    User "1" -- "*" Order: places
    Order "1" -- "*" Product: contains
\`\`\``;
}
