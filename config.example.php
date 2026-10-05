<?php
// Use the existing Satin Time Staff database and accounts. No password copying.
define('AUTH_MODE', 'staff');
define('STAFF_CONFIG_FILE', '/home/satin617/satin-private/config.php');
define('STAFF_URL', 'https://staff.satingraphic.ca');
define('STAFF_ADMIN_URL', 'https://admin.satingraphic.ca');

// Local fallback only:
define('DB_HOST', 'localhost');
define('DB_NAME', 'CPANELUSER_satin');
define('DB_USER', 'CPANELUSER_satin');
define('DB_PASS', 'PUT-THE-DATABASE-PASSWORD-HERE');
define('UPLOAD_DIR', __DIR__ . '/uploads');
