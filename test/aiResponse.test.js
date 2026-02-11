import { describe, expect, test } from 'vitest';
import { extractJsonCandidate, parseAndValidateAIResponse } from '../lib/core/aiResponse.js';

describe('aiResponse', () => {
  test('extractJsonCandidate prefers fenced json', () => {
    const text = `hello\n\n\`\`\`json\n{\n  \"overview\": {\"projectName\": \"X\"},\n  \"codeSnippets\": []\n}\n\`\`\`\n\nbye`;
    expect(extractJsonCandidate(text).trim().startsWith('{')).toBe(true);
    expect(extractJsonCandidate(text)).toContain('overview');
  });

  test('parseAndValidateAIResponse parses loose text with JSON', () => {
    const text = `Some chatter\n{\n  \"overview\": {\"projectName\": \"Plant Monitor\", \"description\": \"demo\"},\n  \"codeSnippets\": [{\"filename\": \"main.ino\", \"language\": \"arduino\", \"code\": \"// ok\"}],\n  \"schematic\": {\"mermaid\": \"graph TD;A-->B;\"},\n  \"bom\": [{\"partNumber\": \"ESP32\", \"quantity\": 1}]\n}\nTrailing commentary`;

    const { parsed, warnings } = parseAndValidateAIResponse(text);
    expect(parsed.overview.projectName).toBe('Plant Monitor');
    expect(parsed.codeSnippets.length).toBe(1);
    expect(Array.isArray(warnings)).toBe(true);
  });

  test('parseAndValidateAIResponse throws on non-JSON', () => {
    expect(() => parseAndValidateAIResponse('no json here')).toThrow(/Failed to parse JSON/i);
  });
});
