// server.js
// Custom Entry Point for Hostinger / Phusion Passenger
// Fixes 'EEXIST at new Socket (node:net:434:13) at process.getStdin' error.

// Hostinger's Passenger environment sometimes incorrectly maps stdin 
// which causes Node 20+ to crash when Next.js 15 tries to access worker_threads or stdin streams.
try {
    // 1. Close standard input file descriptor to prevent EEXIST on fd 0 mapping.
    const fs = require('fs');
    fs.closeSync(0);
} catch (e) {
    // Ignore errors if already closed or inaccessible
}

try {
    // 2. Mock process.stdin to prevent ESM loader or Next.js from crashing on the getter
    Object.defineProperty(process, 'stdin', {
        get: function() {
            return {
                on: function() {},
                once: function() {},
                emit: function() {},
                read: function() {},
                resume: function() {},
                pause: function() {},
                setEncoding: function() {},
                setRawMode: function() {},
                isTTY: false
            };
        },
        configurable: true
    });
} catch (e) {
    // Ignore property override errors
}

// 3. Delegate to the Next.js standalone server
try {
    require('./.next/standalone/server.js');
} catch (e) {
    console.error('Failed to start Next.js standalone server:', e);
    
    // Fallback: If standalone isn't generated or accessible, try to start Next dynamically
    // Note: This requires 'next' to be installed on production
    const nextStart = require('next/dist/cli/next-start').nextStart;
    nextStart([ '-p', process.env.PORT || '3000' ]);
}
