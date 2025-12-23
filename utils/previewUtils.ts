import React from 'react';
import * as FramerMotion from 'framer-motion';
import * as LucideReact from 'lucide-react';

// Access global Babel transform
declare global {
  interface Window {
    Babel: any;
  }
}

export const transformCode = (code: string): string => {
  if (!window.Babel) {
    throw new Error("Babel is not loaded");
  }
  
  try {
    // We must use the 'typescript' preset to strip type annotations
    // from the generated code before the browser can execute it.
    const result = window.Babel.transform(code, {
      presets: ['env', 'react', 'typescript'],
      filename: 'generated.tsx',
    });
    return result.code;
  } catch (err) {
    console.error("Babel transform error:", err);
    throw err;
  }
};

export const executeCode = (code: string) => {
  const exports: { default?: React.ComponentType } = {};
  
  // Create a Require function to inject dependencies
  const require = (moduleName: string) => {
    if (moduleName === 'react') return React;
    if (moduleName === 'framer-motion') return FramerMotion;
    if (moduleName === 'lucide-react') return LucideReact;
    throw new Error(`Module '${moduleName}' not found in preview environment.`);
  };

  // Wrap in a function to isolate scope
  const run = new Function('React', 'require', 'exports', code);
  
  run(React, require, exports);
  
  return exports.default;
};