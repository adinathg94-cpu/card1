// server.js
// Custom Entry Point for Hostinger / Phusion Passenger 
// Fixes 'EEXIST at new Socket (node:net:434:13) at process.getStdin' error.

// Hostinger's environment on Node 20+ sometimes crashes when Next.js 15 
// tries to initialize standard input streams.
try {
  // Mock process.stdin before it's accessed by the ESM loader or Next.js
  const mockStdin = {
    on: () => {},
    once: () => {},
    emit: () => {},
    read: () => {},
    resume: () => {},
    pause: () => {},
    setEncoding: () => {},
    setRawMode: () => {},
    isTTY: false,
    readable: false,
    writable: false,
    destroy: () => {},
    end: () => {},
  };

  // Ensure process.stdin getter doesn't trigger new Socket creation
  Object.defineProperty(process, 'stdin', {
    get: function() { return mockStdin; },
    configurable: true,
    enumerable: true
  });
} catch (e) {
  // Ignore property override errors
}

// Delegate to the Next.js standalone server
try {
  require('./.next/standalone/server.js');
} catch (e) {
  console.error('Failed to load standalone server:', e);
  
  // Fallback if standalone isn't available
  const nextStart = require('next/dist/cli/next-start').nextStart;
  nextStart([ '-p', process.env.PORT || '3000' ]);
}
