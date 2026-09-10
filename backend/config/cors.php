<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | The React frontend (Vite dev server, typically http://localhost:5173)
    | calls this API from a different origin. We use Bearer token auth
    | (Laravel Sanctum personal access tokens), not cookies, so credentials
    | do not need to be supported and origins can be left open for local dev.
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => ['*'],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => false,

];
