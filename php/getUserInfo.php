<?php
require '../vendor/autoload.php';

session_start();

//Guardar API do utilizadr loggado na sessão

$api = $_SESSION['api_obj'];

//Guardar dados do utilizador loggado

$user = $api->me();
$userFile = $user->id . "-user-object.json";

$userObject = array(
    "name" => $user->display_name,
    "id" => $user->id,
    "country" => $user->country,
    "email" => $user->email,
    "n_followers" => $user->followers->total,
    "profile_pic" => $user->images[0]->url,
    "account_type" => $user->product
);

$userData = json_encode($userObject);
$_SESSION['userData'] = $user->id;

file_put_contents($userFile, $userData);

header('Location: ../homepage.php');