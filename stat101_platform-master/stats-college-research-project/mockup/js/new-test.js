(function() {

  // wait until html loads completely to execute code
  window.onload = function() {
    //initialize add option button functionality for the initial question
    $('.addOption').click((event) => {
      event.preventDefault();
      // pass in initial question html to addAnswerChoice
      addAnswerChoice($('.form-group:nth-of-type(2)'));
    });
    // initialize add question button functionality
    $('#addQuestion').click((event) => {
      event.preventDefault();
      addQuestion();
    });
    // initialize save test button mock functionality
    $('#saveTestBtn').click((event) => {
      event.preventDefault();
      saveTest();
    })
  }

  // add a new answer choice option to the answer choice section
  function addAnswerChoice(questionGroup) {
    let answerContainer = questionGroup.find('ol');
    let nextChoiceNumber = questionGroup.find('ol li').length + 1;
    let newChoiceCode = `<li class="list-item"><input class="ml-1 mt-1" placeholder="Answer Choice ` + nextChoiceNumber + `"/></li>`;
    let newChoiceBox = $(newChoiceCode);
    answerContainer.append(newChoiceBox);
    console.log(questionGroup.find('select'));
    questionGroup.find('select').append(updateSelect(nextChoiceNumber));
  }

  // update the choices on the select to match number of answer choices
  // return a new jQuery obj representing the new option
  function updateSelect(choiceNumber) {
    let numToLetter = {
      "1" : 'a',
      "2" : 'b',
      "3" : 'c',
      "4" : 'd',
      "5" : 'e',
      "6" : 'f'
    };
    let letter = numToLetter[choiceNumber];
    let newOptionCode = `<option value="` + letter + `>` + letter + `</option>`;
    let newOption = $(newOptionCode);
    console.log(newOption);
    return newOption;
  }

  // make a new question group and append it after the last question group
  function addQuestion() {
    let addButton = $('#addQuestion');
    let questionNumber = $('form .form-group').length;
    let newQuestion = $(`
      <div class="form-group">
        <div class="card">
          <div class="card-body">
            <h3 class="card-title">1.</h3>
            <input class="question-title" placeholder="Question Title (optional)"/>
            <textarea class="mt-2" name="question text" rows="5" cols="80">Enter question text here.</textarea>
            <ol type="a" class="list-group d-flex flex-column">
              <li class="list-item"><input class="ml-1 mt-3" placeholder="Answer Choice 1"/></li>
              <li class="list-item"><input class="ml-1 mt-1" placeholder="Answer Choice 2"/></li>
            </ol>
            <button class="addOption btn btn-primary btn-sm mt-3">Add Option</button>
            <h6 class="mt-3">Correct Answer:</h6>
            <select class="correct-ans">
              <option value="a">a</option>
              <option value="b">b</option>
            </select>
          </div>
        </div>
      </div>
    `);
    // append add option functionality to new question group
    newQuestion.find('button').click((event) => {
      event.preventDefault();
      addAnswerChoice(newQuestion);
    });
    newQuestion.insertBefore(addButton);
  }

  // mockup functionality for saving a test
  function saveTest() {
    let form = $('form');
    form.addClass('d-none');
    let successMsg = $('#successMsg');
    successMsg.removeClass('d-none');
  }

})();
