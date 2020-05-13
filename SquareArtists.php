<?php
session_start();
$session_value = (isset($_SESSION['userData'])) ? $_SESSION['userData'] : '';
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Music Taste Visualiser</title>

    <link rel="stylesheet" type="text/css" href="css/style.css">

    <script type="text/javascript">
        var userid = '<?php echo $session_value;?>';
    </script>

    <script src="p5/p5.js"></script>
    <script src="p5/addons/p5.sound.js"></script>

    <script src="https://cdn.deepstream.io/js/client/latest/ds.min.js"></script>
</head>
<body>
<script src="js/SquareArtists.js"></script>
</body>
</html>
