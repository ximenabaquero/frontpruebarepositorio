<?php

declare(strict_types=1);

require __DIR__ . '/db.php';

$ok = true;
$dbOk = false;
$error = null;

try {
    db()->query('SELECT 1');
    $dbOk = true;
} catch (Throwable $e) {
    $ok = false;
    $error = $e->getMessage();
}

header('Content-Type: text/plain; charset=utf-8');

echo "php_ok=" . ($ok ? '1' : '0') . "\n";
echo "db_ok=" . ($dbOk ? '1' : '0') . "\n";
if ($error !== null) {
    echo "error=" . $error . "\n";
}
