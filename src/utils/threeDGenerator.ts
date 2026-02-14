import { ThreeDModelData } from '../types';

export function generate3DModel(description: string): ThreeDModelData {
  const desc = description.toLowerCase();
  
  // Determine the type of 3D model based on description
  if (desc.includes('robot')) {
    return {
      type: 'robot',
      parameters: {
        bodyWidth: 1,
        bodyHeight: 1.5,
        bodyDepth: 0.8,
        headSize: 0.5,
        armLength: 0.8,
        legHeight: 0.6,
        wheelRadius: 0.2,
        color: 0x3b82f6,
      },
    };
  }
  
  if (desc.includes('drone') || desc.includes('quadcopter')) {
    return {
      type: 'drone',
      parameters: {
        bodyWidth: 0.4,
        bodyHeight: 0.15,
        armLength: 0.6,
        propellerRadius: 0.25,
        motorSize: 0.1,
        cameraSize: 0.08,
        color: 0x1e293b,
      },
    };
  }
  
  if (desc.includes('phone') || desc.includes('mobile')) {
    return {
      type: 'phone',
      parameters: {
        width: 0.07,
        height: 0.15,
        depth: 0.008,
        screenRatio: 19.5,
        bezelSize: 0.003,
        color: 0x0f172a,
        screenColor: 0x1e293b,
      },
    };
  }
  
  if (desc.includes('laptop') || desc.includes('computer')) {
    return {
      type: 'laptop',
      parameters: {
        screenWidth: 0.35,
        screenHeight: 0.22,
        baseWidth: 0.35,
        baseDepth: 0.25,
        thickness: 0.02,
        hingeSize: 0.015,
        color: 0x64748b,
      },
    };
  }
  
  if (desc.includes('speaker') || desc.includes('audio')) {
    return {
      type: 'speaker',
      parameters: {
        width: 0.2,
        height: 0.35,
        depth: 0.15,
        driverRadius: 0.08,
        tweeterRadius: 0.03,
        portRadius: 0.04,
        color: 0x1e293b,
        grilleColor: 0x334155,
      },
    };
  }
  
  if (desc.includes('watch') || desc.includes('wearable')) {
    return {
      type: 'watch',
      parameters: {
        caseSize: 0.04,
        caseDepth: 0.012,
        bandWidth: 0.02,
        bandLength: 0.25,
        screenSize: 0.032,
        color: 0x0f172a,
        bandColor: 0x475569,
      },
    };
  }
  
  if (desc.includes('IoT') || desc.includes('sensor') || desc.includes('device')) {
    return {
      type: 'iot_device',
      parameters: {
        width: 0.08,
        height: 0.06,
        depth: 0.03,
        antennaLength: 0.05,
        ledCount: 3,
        buttonCount: 2,
        color: 0xf8fafc,
        accentColor: 0x0ea5e9,
      },
    };
  }
  
  if (desc.includes('car') || desc.includes('vehicle')) {
    return {
      type: 'car',
      parameters: {
        length: 0.4,
        width: 0.18,
        height: 0.1,
        wheelRadius: 0.035,
        wheelWidth: 0.025,
        wheelbase: 0.22,
        color: 0xef4444,
        windowColor: 0x64748b,
      },
    };
  }
  
  // Default generic product/prototype
  return {
    type: 'generic',
    parameters: {
      width: 0.1,
      height: 0.1,
      depth: 0.1,
      color: 0x3b82f6,
      accentColor: 0xffffff,
      detailLevel: 'medium',
    },
  };
}

export function create3DObject(data: ThreeDModelData): THREE.Group {
  // This will be used in the ThreeDViewer component
  // The actual Three.js object creation happens there
  return new (require('three').Group)();
}
