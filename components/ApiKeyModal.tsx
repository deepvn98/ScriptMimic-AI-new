import React from 'react';

/**
 * Neutralized component to comply with Google GenAI SDK guidelines 
 * which prohibit UI elements for manual API key entry.
 * API keys are managed via environment variables (process.env.API_KEY).
 */
const ApiKeyModal: React.FC<any> = () => {
  return null;
};

export default ApiKeyModal;