<?php
require '../vendor/autoload.php';

session_start();

$api = $_SESSION['api_obj'];
$trackId = $_GET['id'];

$trackData = $api->getAudioAnalysis($trackId);
$trackAnalysisFile = "trackAnalysis.json";
$trackAnalysis = json_encode($trackData);

file_put_contents($trackAnalysisFile, $trackAnalysis);

header('Location: ../solo_track.php');