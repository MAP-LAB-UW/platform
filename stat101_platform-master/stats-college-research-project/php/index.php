<?php

/*************************************************************************
 * HTML code for all pages
 *************************************************************************/
function formatPageCode($inner_html) {
  $html = <<<BASE
  <!DOCTYPE html>
  <html lang="en" dir="ltr">
    <head>
      <meta charset="utf-8">
      <title>Teacher Home</title>
      <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
      <!-- Custom Styles -->
      <link href="css/styles.css" rel="stylesheet" type="text/css">
      <!-- Custom Fonts -->
      <link href="https://fonts.googleapis.com/css?family=Encode+Sans" rel="stylesheet">
      <!-- jQuery -->
      <script
        src="https://code.jquery.com/jquery-3.3.1.slim.min.js"
        integrity="sha256-3edrmyuQ0w65f8gfBsqowzjJe2iM6n0nKciPUp8y+7E="
        crossorigin="anonymous"></script>
      <!-- Custom js -->
      <script src="js/new-test.js" type="text/javascript"></script>
    </head>
    <body>
      {$inner_html}  
    </body>
  </html>
BASE;

  return $html;
}


/**********************************************************************
 * HTML End
 **********************************************************************/

include 'teacher_view/teacher-home.php'; // loads $teacher_home_HTML variable
include 'teacher_view/new-test.php'; // loads $teacher_new_test_HTML variable
include 'teacher_view/teacher-monitor.php'; // loads $teacher_monitor_HTML variable
include 'teacher_view/teacher-tests.php'; // loads $teacher_tests_HTML variable 
include 'teacher_view/teacher-view.php'; // loads $teacher_view_HTML variable

echo(formatPageCode($teacher_home_HTML));    

?>