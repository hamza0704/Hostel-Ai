import { ComplaintCategory, ComplaintPriority } from '@/types';

// Keywords for category classification
const categoryKeywords: Record<ComplaintCategory, string[]> = {
  water: ['water', 'tap', 'leak', 'plumbing', 'pipe', 'bathroom', 'toilet', 'shower', 'drain', 'flood', 'wet', 'drip'],
  electricity: ['power', 'electric', 'light', 'bulb', 'socket', 'outlet', 'switch', 'fan', 'ac', 'air conditioner', 'voltage', 'current', 'wire', 'fuse'],
  cleanliness: ['clean', 'dirty', 'garbage', 'trash', 'dust', 'hygiene', 'pest', 'cockroach', 'rat', 'insect', 'smell', 'odor', 'washroom', 'mess', 'stain'],
  internet: ['wifi', 'internet', 'network', 'connection', 'router', 'speed', 'slow', 'disconnect', 'online', 'lan', 'broadband'],
  security: ['security', 'lock', 'door', 'key', 'theft', 'stolen', 'break', 'window', 'cctv', 'camera', 'guard', 'safe', 'stranger', 'unauthorized']
};

// Keywords for priority classification
const highPriorityKeywords = [
  'urgent', 'emergency', 'immediately', 'critical', 'dangerous', 'no water', 'no electricity',
  'flooding', 'fire', 'theft', 'stolen', 'break-in', 'security breach', 'hazard', 'shock',
  'since morning', 'since yesterday', 'whole day', 'not working at all', 'completely'
];

const mediumPriorityKeywords = [
  'issue', 'problem', 'not working', 'broken', 'slow', 'intermittent', 'sometimes',
  'difficult', 'inconvenient', 'annoying', 'need help', 'please fix'
];

export function classifyCategory(text: string): ComplaintCategory {
  const lowerText = text.toLowerCase();
  
  let maxScore = 0;
  let detectedCategory: ComplaintCategory = 'cleanliness';
  
  for (const [category, keywords] of Object.entries(categoryKeywords) as [ComplaintCategory, string[]][]) {
    let score = 0;
    for (const keyword of keywords) {
      if (lowerText.includes(keyword)) {
        score += 1;
      }
    }
    if (score > maxScore) {
      maxScore = score;
      detectedCategory = category;
    }
  }
  
  return detectedCategory;
}

export function classifyPriority(text: string): ComplaintPriority {
  const lowerText = text.toLowerCase();
  
  // Check for high priority indicators
  for (const keyword of highPriorityKeywords) {
    if (lowerText.includes(keyword)) {
      return 'high';
    }
  }
  
  // Check for medium priority indicators
  for (const keyword of mediumPriorityKeywords) {
    if (lowerText.includes(keyword)) {
      return 'medium';
    }
  }
  
  return 'low';
}

export function analyzeComplaint(description: string): { category: ComplaintCategory; priority: ComplaintPriority } {
  return {
    category: classifyCategory(description),
    priority: classifyPriority(description)
  };
}

export function getAIConfidence(description: string): number {
  const lowerText = description.toLowerCase();
  let matchCount = 0;
  
  // Count total keyword matches
  for (const keywords of Object.values(categoryKeywords)) {
    for (const keyword of keywords) {
      if (lowerText.includes(keyword)) {
        matchCount++;
      }
    }
  }
  
  // Calculate confidence based on matches
  const confidence = Math.min(95, 60 + matchCount * 5);
  return confidence;
}
