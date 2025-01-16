<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

/*
Route::get('/', function () {
    return view('welcome');
});

Route::get('/question-repo', function() {
    return view('question-repo');
});
*/

Auth::routes();

Route::get( '/{path?}', function(){
    return view( 'welcome' );
} )->where('path', '.*');
//^(?!email\/verify).*$
// Route::get('email/verify/{userId}', function() {
//     return view('auth/verify');
// });

// Auth::routes(['verify' => true]);

