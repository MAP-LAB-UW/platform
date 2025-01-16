<?php

$teacher_home_HTML = <<<TEACHER_HOME
    <header>
      <div class="jumbotron jumbotron-fluid bg-light">
        <div class="container text-center">
          <h1>Home</h1>
        </div>
      </div>
    </header>
    <main>
      <nav class="d-flex flex-column">
        <a href="teacher-home.html" class="text-center mt-4">
          <img src="imgs/home.png" alt="home"/>
          <p class="text-white">Home</p>
        </a>
        <a href="teacher-tests.html" class="text-center">
          <img class="navLink" src="imgs/test.png" alt="create, edit, and publish tests"/>
          <p class="text-dark">Create/Edit Tests</p>
        </a>
        <a href="teacher-monitor.html" class="text-center">
          <img class="navLink" src="imgs/monitor.png" alt="create, edit, and publish tests"/>
          <p class="text-dark">Monitor Test Progress</p>
        </a>
      </nav>
      <div class="container">
        <div class="text-center">
          <h2>Current Published Test</h2>
          <h3>z-scores and the normal curve</h3>
          <progress value="50" max="100">50%</progress>
          <p>18/36 finished</p>
        </div>
        <div class="card-deck d-flex justify-content-around ml-auto mr-auto mt-5">
          <div class="card">
            <a href="teacher-tests.html">
              <div class="text-center mt-1">
                <img src="imgs/test.png" alt="test"/>
              </div>
              <div class="card-body">
                <h4 class="card-title">Create, Edit, and Publish Tests</h4>
              </div>
            </a>
          </div>
          <div class="card">
            <a href="#">
              <div class="text-center mt-1">
                <img src="imgs/monitor.png" alt="monitor"/>
              </div>
              <div class="card-body">
                <h4 class="card-title">Monitor Student Progress</h4>
              </div>
            </a>
          </div>
        </div>
      </div>
    </main>
    <footer>

    </footer>
TEACHER_HOME;

?>