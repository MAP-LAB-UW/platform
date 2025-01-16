<?php


$teacher_tests_HTML = <<<TEACHER_TESTS
<header>
<div class="jumbotron jumbotron-fluid bg-light">
  <div class="container text-center">
    <h1>Create, Edit, and Publish Tests</h1>
  </div>
</div>
</header>
<main>
<nav class="d-flex flex-column">
  <a href="teacher-home.html" class="text-center mt-4">
    <img src="imgs/home.png" alt="home"/>
    <p class="text-dark">Home</p>
  </a>
  <a href="" class="text-center">
    <img class="navLink" src="imgs/test.png" alt="create, edit, and publish tests"/>
    <p class="text-white">Create/Edit Tests</p>
  </a>
  <a href="teacher-monitor.html" class="text-center">
    <img class="navLink" src="imgs/monitor.png" alt="create, edit, and publish tests"/>
    <p class="text-dark">Monitor Test Progress</p>
  </a>
</nav>
<div class="container">
  <div class="card-deck d-flex justify-content-around ml-auto mr-auto mt-5">
    <div class="card">
      <a href="teacher-view.html">
        <div class="text-center mt-1">
          <img src="imgs/test.png" alt="test"/>
        </div>
        <div class="card-body text-center">
          <h4 class="card-title">View Tests</h4>
          <p class="card-text">Look at current and past tests</p>
        </div>
      </a>
    </div>
    <div class="card">
      <a href="new-test.html">
        <div class="text-center mt-1">
          <img src="imgs/add.png" alt="make a test"/>
        </div>
        <div class="card-body text-center">
          <h4 class="card-title">Create A New Test</h4>
          <p class="card-text">create and publish a new test</p>
        </div>
      </a>
    </div>
    <!--
    <div class="card">
      <a href="#">
        <div class="text-center mt-1">
          <img src="imgs/past.png" alt="past tests"/>
        </div>
        <div class="card-body text-center">
          <h4 class="card-title">Past Tests</h4>
          <p class="card-text">Look at past tests</p>
        </div>
      </a>
    </div>
    -->
  </div>
</div>
</main>
<footer>

</footer>
TEACHER_TESTS;


?>