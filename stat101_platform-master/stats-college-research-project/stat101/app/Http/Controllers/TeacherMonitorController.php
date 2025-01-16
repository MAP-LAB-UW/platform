<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\TestInstance;
use App\TestBank;
use App\User;
use App\TestItemRel;
use App\ItemInstance;

// Controller for Teacher Monitor page

class TeacherMonitorController extends Controller
{
    
    /**
     * @param Illuminate\Http\Request $request with 1 field:
     * $testId -> int -> TestBank id of test to get data
     * @return Illuminate\Http\Response
     * returns data on all students taking tests
     */
    public function getStudentTestData(Request $request) {
        // check if test is published
        $testId = $request->id;
        $testBank = TestBank::find($testId);
        if ($testBank->published == "draft") {
            App::abort(500, "Test Hasnt been published");
        }

        $res = [];

        // get all TestInstance models
        $testInstances = TestInstance::where('test_id', '=', $testId)->get();

        // get number of questions
        $numberOfQuestions = TestItemRel::where('test_id', '=', $testId)->get()->count();
        $res["totalQuestions"] = $numberOfQuestions;

        // get name
        $res["testName"] = $testBank->test_name;

        // get all students
        $students = User::where('user_type', '=', 'student')->get();
        $res["students"] = [];
        foreach($students as $student) {
            $thisStudentsData = [];
            $studentId = $student->id;

            if ($this->startedTest($studentId, $testId)) {
                $thisStudentsData["started"] = true;
                
                $testInstance = TestInstance::where([
                    ['test_id', '=', $testId],
                    ['student_id', '=', $studentId],
                ])->get()->first();

                $numCorrect = $testInstance->score;
                $numAnswered = ItemInstance::where([
                    ['test_instance_id', '=', $testInstance->id],
                    ['answer', '!=', null],
                ])->get()->count();
                $thisStudentsData["correct"] = $numCorrect;
                $thisStudentsData["incorrect"] = $numAnswered - $numCorrect;
            } else {
                $thisStudentsData["started"] = false;
            }
            $thisStudentsData["name"] = $student->name;

            array_push($res["students"], $thisStudentsData);
        }

        return response($res, 200);
    }

    private function startedTest($studentId, $testId) {
        $isEmpty = TestInstance::where([
            ['test_id', '=', $testId],
            ['student_id', '=', $studentId],
        ])->get()->isEmpty();
        if ($isEmpty) {
            return false;
        } else {
            return true;
        }
        
    }
}
