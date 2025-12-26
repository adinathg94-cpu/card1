module.exports = {
    apps: [{
        name: 'kindora-app',
        script: './server.js',

        // Clustering for better performance
        instances: 'max', // Use all available CPU cores
        exec_mode: 'cluster',

        // Environment
        env: {
            NODE_ENV: 'production',
            PORT: 3000
        },

        // Logging
        error_file: './logs/error.log',
        out_file: './logs/access.log',
        log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
        merge_logs: true,

        // Process management
        autorestart: true,
        max_memory_restart: '1G',
        watch: false,

        // Advanced options
        min_uptime: '10s',
        max_restarts: 10,
        restart_delay: 4000,

        // Node.js options
        node_args: '--max-old-space-size=1024'
    }]
};
