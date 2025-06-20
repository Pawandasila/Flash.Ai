/**
 * Utility to classify user messages and determine appropriate response handling
 */

export interface MessageClassification {
  isCodeRequest: boolean;
  isConversational: boolean;
  confidence: number;
  detectedKeywords: string[];
  suggestedFramework?: string;
  suggestedLanguage?: string;
}

export class MessageClassifier {
  private static codeKeywords = [
    // Action verbs for creation
    'create', 'build', 'generate', 'make', 'develop', 'implement', 'program', 'write', 'design',
    
    // Code-related terms
    'code', 'component', 'app', 'website', 'application', 'function', 'class', 'module',
    
    // Technologies
    'html', 'css', 'javascript', 'react', 'vue', 'angular', 'node', 'typescript', 'python',
    'php', 'java', 'c++', 'c#', 'go', 'rust', 'swift', 'kotlin',
    
    // UI/UX terms
    'button', 'form', 'modal', 'navbar', 'sidebar', 'dashboard', 'landing page', 'carousel',
    'dropdown', 'menu', 'header', 'footer', 'layout', 'responsive',
    
    // Specific requests
    'api', 'endpoint', 'database', 'authentication', 'login', 'signup', 'crud', 'rest',
    'graphql', 'webhook', 'socket', 'real-time', 'chat', 'messaging',
    
    // File types
    '.js', '.ts', '.jsx', '.tsx', '.html', '.css', '.scss', '.json', '.xml', '.sql'
  ];

  private static conversationalKeywords = [
    // Question words
    'what', 'why', 'how', 'when', 'where', 'who', 'which',
    
    // Explanation requests
    'explain', 'tell me', 'describe', 'define', 'meaning', 'purpose', 'difference',
    'compare', 'contrast', 'pros', 'cons', 'advantages', 'disadvantages',
    
    // Help requests
    'help', 'assist', 'guide', 'tutorial', 'learn', 'understand', 'confused',
    'stuck', 'problem', 'issue', 'error', 'bug', 'debugging',
    
    // General conversation
    'hello', 'hi', 'hey', 'thanks', 'thank you', 'please', 'sorry'
  ];

  private static frameworkKeywords = {
    react: ['react', 'jsx', 'tsx', 'hooks', 'component', 'useState', 'useEffect'],
    vue: ['vue', 'vuejs', 'composition api', 'options api', 'nuxt'],
    angular: ['angular', 'typescript', 'component', 'service', 'directive'],
    svelte: ['svelte', 'sveltekit'],
    nextjs: ['next.js', 'nextjs', 'next', 'ssr', 'static generation'],
    nodejs: ['node.js', 'nodejs', 'express', 'fastify', 'koa']
  };

  private static languageKeywords = {
    javascript: ['javascript', 'js', 'node', 'npm', 'yarn'],
    typescript: ['typescript', 'ts', 'types', 'interface', 'type'],
    python: ['python', 'py', 'django', 'flask', 'fastapi'],
    html: ['html', 'markup', 'semantic'],
    css: ['css', 'styles', 'styling', 'tailwind', 'bootstrap', 'sass', 'scss']
  };

  static classify(message: string): MessageClassification {
    const lowerMessage = message.toLowerCase();
    const words = lowerMessage.split(/\s+/);
    
    const codeMatches = this.codeKeywords.filter(keyword => 
      lowerMessage.includes(keyword.toLowerCase())
    );
    
    const conversationalMatches = this.conversationalKeywords.filter(keyword => 
      lowerMessage.includes(keyword.toLowerCase())
    );

    // Calculate confidence based on keyword matches and message structure
    const codeScore = codeMatches.length;
    const conversationalScore = conversationalMatches.length;
    
    // Additional scoring based on sentence structure
    const hasImperativeVerbs = /^(create|build|make|generate|develop|implement|write|design)/i.test(message.trim());
    const hasQuestionWords = /^(what|why|how|when|where|who|which|explain|tell me|describe)/i.test(message.trim());
    
    const adjustedCodeScore = codeScore + (hasImperativeVerbs ? 2 : 0);
    const adjustedConversationalScore = conversationalScore + (hasQuestionWords ? 2 : 0);
    
    const isCodeRequest = adjustedCodeScore > adjustedConversationalScore && adjustedCodeScore > 0;
    const confidence = Math.max(adjustedCodeScore, adjustedConversationalScore) / Math.max(words.length * 0.1, 1);
    
    // Detect framework and language
    const suggestedFramework = this.detectFramework(lowerMessage);
    const suggestedLanguage = this.detectLanguage(lowerMessage);

    return {
      isCodeRequest,
      isConversational: !isCodeRequest,
      confidence: Math.min(confidence, 1),
      detectedKeywords: isCodeRequest ? codeMatches : conversationalMatches,
      suggestedFramework,
      suggestedLanguage
    };
  }

  private static detectFramework(message: string): string | undefined {
    for (const [framework, keywords] of Object.entries(this.frameworkKeywords)) {
      if (keywords.some(keyword => message.includes(keyword))) {
        return framework;
      }
    }
    return undefined;
  }

  private static detectLanguage(message: string): string | undefined {
    for (const [language, keywords] of Object.entries(this.languageKeywords)) {
      if (keywords.some(keyword => message.includes(keyword))) {
        return language;
      }
    }
    return undefined;
  }

  /**
   * Get suggestions for improving ambiguous requests
   */
  static getSuggestions(message: string): string[] {
    const classification = this.classify(message);
    const suggestions: string[] = [];

    if (classification.confidence < 0.3) {
      suggestions.push("Your request is a bit ambiguous. Try being more specific.");
      
      if (!classification.isCodeRequest) {
        suggestions.push("If you want code generated, use words like 'create', 'build', or 'generate'.");
      }
      
      if (classification.isCodeRequest && !classification.suggestedFramework) {
        suggestions.push("Specify which framework you'd like (React, Vue, Angular, etc.).");
      }
    }

    return suggestions;
  }
}

export default MessageClassifier;
