<?php

$teacher_view_HTML = <<<TEACHER_VIEW
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
  <div id="testViewCardDeck" class="card-deck d-flex ml-5 mt-5">
    <div class="card">
      <div class="card-body">
        <h4 class="card-title">Normal Curves</h4>
        <ul class="list-group list-group-flush">
          <li class="list-group-item">30 questions</li>
          <li class="list-group-item">Created 4/4/19</li>
          <li class="list-group-item">Not Published</li>
        </ul>
        <button class="btn btn-small btn-primary mt-3">Publish</button>
        <button class="btn btn-small btn-secondary mt-3">Edit Test</button>
      </div>
    </div>
    <div class="card">
      <div class="card-body">
        <h4 class="card-title">Z-scores</h4>
        <ul class="list-group list-group-flush">
          <li class="list-group-item">38 questions</li>
          <li class="list-group-item">Created 3/29/19</li>
          <li class="list-group-item text-success">Published</li>
        </ul>
        <button class="btn btn-small btn-primary mt-3">Monitor</button>
        <button class="btn btn-small btn-secondary mt-3">Close Test</button>
      </div>
    </div>
  </div>
</div>
</main>
<footer>

</footer>
TEACHER_VIEW;


?>