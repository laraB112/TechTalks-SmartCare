<?php

return [
    'paths' => ['*'], // ← Allow all paths
    
    'allowed_methods' => ['*'], // ← Allow all methods
    
    'allowed_origins' => [
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'http://localhost',
        'http://127.0.0.1',
    ],
    
    'allowed_origins_patterns' => [],
    
    'allowed_headers' => ['*'], // ← Allow all headers
    
    'exposed_headers' => [],
    
    'max_age' => 0,
    
    'supports_credentials' => true,
];