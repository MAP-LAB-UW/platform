<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

// filter questions
Route::get('filter/{topic}', 'ItemBankController@searchByTopic');

// get a specific question and it's relationships
Route::get('question/{question_entity_id}', 'ItemBankController@getQuestion');

// get a test based on id
Route::get('tests/edit-test/{id}', 'TestBankController@find');

// check if a test is published
Route::get('tests/published/{id}', 'TestBankController@checkPublished');

// Safe routes, must have JWT token to access
Route::group(['middleware' => 'jwt.verify'], function() {
    // filter tests by topic
    Route::post('tests/filter', 'TestBankController@filter');

    // publish a test
    Route::post('tests/publish/{id}', 'TestBankController@publish');

    // unpublish a test
    Route::post('tests/unpublish/{id}', 'TestBankController@unpublish');

    // update a test
    Route::post('update-test/{id}', 'TestBankController@update');

    // get a list of student tests
    Route::post('student-tests', 'TestBankController@getPublishedTests');

    // logout a user
    Route::post('/logout', 'AuthController@logout');

    // update a question
    Route::post('question/update/{id}', 'ItemBankController@update');

    // get all questions or add a new question
    Route::resource('all_questions', 'ItemBankController');

    // add a new test or get a list of all tests
    Route::resource('tests', 'TestBankController');

    // start a test
    Route::post('/start-test', 'TakeTestController@startTest');

    // resume a test
    Route::post('/resume-test', 'TakeTestController@resumeTest');

    // save an answer
    Route::post('/save-answer', 'TakeTestController@saveAnswerChoice');

    // save start time for a question
    Route::post('/start-question', 'TakeTestController@startItemInstanceTimer');

    // get student progress for a certain test
    Route::post('/monitor-test', 'TeacherMonitorController@getStudentTestData');

    // grade a test
    Route::post('/grade-test', 'TakeTestController@grade');
});



// // check if tests should be graded and closed
// Route::post('/check-test-end', 'TakeTestController@gradeAllTests');

// login a user
Route::post('/login', 'APILoginController@login');

// register a user
Route::post('/register', 'APILoginController@register');