<?php
header("Content-Type: application/json");

$response = [
    "message" => "Hello, this is a simple PHP API!",
    "timestamp" => date("Y-m-d H:i:s")
];

echo json_encode($response);
?>
