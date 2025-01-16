<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Carbon\Carbon;
use App\TestBank;
use App\TestItemRel;
use App\ItemBank;
use App\QuestionEntity;
use App\OptionEntity;
use App\ItemInstance;
use App\TestInstance;

// Contains various methods to return data for Students taking a test

class TakeTestController extends Controller
{
    //
    /**
     * @param Illuminate\Http\Request $request 
     *      $request fields:
     *      int $testId -> id of test to start
     *      int $studentId -> id of student taking test
     * @return array[
     *      // each one of these represents a all the data needed to show a question to the student
     *      array[
     *          questionNumber => int, // the sequential number of the question
     *          questionBody => String, // body text of question
     *          choices => array[ [label => String, text => String] ], // each array in choices represents one answer choice and its corresponding choice label
     *          correctAnswer => String, // correct answer choice letter
     *      ]
     * ]
     * 
     * Creates relevant ItemInstance models as well as a TestInstance model
     */
    public function startTest(Request $request) {
        $res = [];

        // get all relevant TestItemRel instances
        $testItemRels = TestItemRel::where('test_id', '=', $request->testId)->get();

        // make a new TestInstance item
        $testInstance = new TestInstance();
        $testInstance->test_id = $request->testId;
        $testInstance->status = 'in_progress';
        $testInstance->student_id = $request->studentId;
        $testInstance->start_time = Carbon::now();
        $testInstance->score = 0;
        $testInstance->save();

        // get all relevant ItemBank instances
        for($i = 0; $i < $testItemRels->count(); $i++) {
            $testItemRel = $testItemRels[$i];

            // make an ItemInstance model
            $itemInstance = new ItemInstance();
            $itemInstance->question_number = $i + 1; // don't want the first number to be 0
            $itemInstance->item_id = $testItemRel->item_id;
            $itemInstance->test_instance_id = $testInstance->id;
            // if this is the first question start the timer
            if ($i == 0) {
                $itemInstance->start_time = Carbon::now();
            }
            $itemInstance->save();

            // find the ItemBank model
            $itemBank = ItemBank::find($testItemRel->item_id);
            // get the image link, if any
            $imgLink = $itemBank->image;
            // get the correct answer
            $correctAnswer = $itemBank->correct_answers;
            // find the QuestionEntity model
            $questionEntity = QuestionEntity::find($itemBank->question_entity_id);
            // get the question body
            $questionBody = $questionEntity->question;
            // find related OptionEntity models
            $optionEntities = OptionEntity::where('item_id', '=', $itemBank->id)->get();
            $choices = [];
            // get all choices
            foreach ($optionEntities as $option) {
                $choice = ["label" => $option->choice_label, "text" => $option->choice];
                array_push($choices, $choice);
            }
            // format results and add it to $res
            $question = ["questionNumber" =>  $i + 1, "questionBody" => $questionBody, "choices" => $choices, 
            "correctAnswer" => $correctAnswer, "isComplete" => false, "itemInstanceId" => $itemInstance->id, "imgLink" => $imgLink];
            array_push($res, $question);
        }

        $testName = TestBank::find($request->testId)->test_name;

        $res["testInfo"] = ["testInstanceId" => $testInstance->id, "testBankId" => $request->testId, "testName" => $testName];
        return $res;
    }

    /**
     * @param Illuminate\Http\Request $request
     * @return array[
     *      // each one of these represents a all the data needed to show a question to the student
     *      array[
     *          questionNumber => int, // the sequential number of the question
     *          questionBody => String, // body text of question
     *          choices => array[ [label => String, text => String] ], // each array in choices represents one answer choice and its corresponding choice label
     *          correctAnswer => String, // correct answer choice letter
     *      ]
     * ]
     * 
     * returns relevant data to resume test taking
     */
    public function resumeTest(Request $request) {
        $res = [];

        // get TestInstance Model
        $testInstance = TestInstance::where([
            ['student_id', '=', $request->studentId],
            ['test_id', '=', $request->testId],
        ])->get()->first();

        // get all relevant TestItemRel instances
        $testItemRels = TestItemRel::where('test_id', '=', $request->testId)->get();

        // get all relevant ItemBank instances
        for($i = 0; $i < $testItemRels->count(); $i++) {
            $testItemRel = $testItemRels[$i];

            // get existing ItemInstance model
            $itemInstance = ItemInstance::where('item_id', '=', $testItemRel->item_id)->get()->first();

            // find the ItemBank model
            $itemBank = ItemBank::find($testItemRel->item_id);
            // get the image link, if any
            $imgLink = $itemBank->image;
            // get the correct answer
            $correctAnswer = $itemBank->correct_answers;
            // find the QuestionEntity model
            $questionEntity = QuestionEntity::find($itemBank->question_entity_id);
            // get the question body
            $questionBody = $questionEntity->question;
            // find related OptionEntity models
            $optionEntities = OptionEntity::where('item_id', '=', $itemBank->id)->get();
            $choices = [];
            // get all choices
            foreach ($optionEntities as $option) {
                $choice = ["label" => $option->choice_label, "text" => $option->choice];
                array_push($choices, $choice);
            }
            
            // check if question has been answered
            $isComplete = false;
            if ($itemInstance->end_time != null) {
                $isComplete = true;
            }

            $savedAnswer = false;
            if ($itemInstance->answer != null) {
                $savedAnswer = $itemInstance->answer;
            }

            // format results and add it to $res
            $question = ["questionNumber" =>  $itemInstance->question_number, "questionBody" => $questionBody, "choices" => $choices, 
            "correctAnswer" => $correctAnswer, "isComplete" => $isComplete, "itemInstanceId" => $itemInstance->id, 
            "savedAnswer" => $savedAnswer, "imgLink"=> $imgLink];
            array_push($res, $question);
        }

        $testName = TestBank::find($testInstance->test_id)->test_name;

        $res["testInfo"] = ["testInstanceId" => $testInstance->id, "testBankId" => $request->testId, "testName" => $testName];

        return $res;
    }

    /**
     * @param Illuminate\Http\Request $request -> POST request
     * @return Illuminate\Http\Response
     * Called to grade a test and/or set the end time
     */
    // public function gradeTest(Request $request) {
    //     $this->endAndGradeTest($request->id);
    // }

    /**
     * @param int id -> id of TestInstance to grade
     * @return Illuminate\Http\Response
     * Called to grade a test and/or set the end time
     */
    // private function endAndGradeTest($id) {
    //     $testInstanceId = $id;
    //     $testInstance = TestInstance::find($testInstanceId);
    //     $testInstance->end_time = Carbon::now();

    //     // get all ItemInstance models
    //     $itemInstances = ItemInstance::where('test_instance_id', '=', $testInstanceId)->get();
    //     $numCorrect = 0;

    //     foreach ($itemInstances as $itemInstance) {
    //         // find corresponding ItemBank model
    //         $itemBank = ItemBank::find($itemInstance->item_id);
    //         if ($itemInstance->answer == $itemBank->correct_answers) {
    //             $numCorrect++;
    //         }
    //     }
    //     $testInstance->score = $numCorrect;
    //     $saved = $testInstance->save();

    //     if ($saved) {
    //         return response("Saved Successfully", 200);
    //     } else {
    //         App::abort(500, "Error");
    //     }
    // }

    // /**
    //  * Checks every published test to see if the test needs to be closed and graded
    //  * @return array[int] $gradedIds -> ids of tests that were closed and graded
    //  */
    // public function gradeAllTests(Request $request) {
    //     $publishedTests = TestBank::where('status', '=', 'published')->get();
    //     $gradedIds = [];
    //     foreach($publishedTests as $test) {
    //         // it is past the tests end time
    //         if ($test->end_time < Carbon::now()) {
    //             $testInstances = TestInstance::where('test_id', '=', $test->id)->get();
    //             foreach($testInstances as $testInstance) {
    //                 if ($testInstance->end_time != null) { // test has been graded already, don't regrade
    //                     $this->endAndGradeTest($testInstance->id);
    //                 }
    //             }
    //             $test->status = "draft";
    //             $test->save();
    //             array_push($gradedIds, $test->id);
    //         }
    //     }
    //     return $gradedIds;
    // }

    /**
     * @param int id -> id of TestInstance to grade
     * @return Illuminate\Http\Response
     * Called to grade a test and/or set the end time
     */
    private function gradeTest($id) {
        $testInstanceId = $id;
        $testInstance = TestInstance::find($testInstanceId);

        // get all ItemInstance models
        $itemInstances = ItemInstance::where('test_instance_id', '=', $testInstanceId)->get();
        $numCorrect = 0;

        // grade each ItemInstance and check if all are answered
        $complete = true;
        foreach ($itemInstances as $itemInstance) {
            // find corresponding ItemBank model
            $itemBank = ItemBank::find($itemInstance->item_id);
            if ($itemInstance->answer == $itemBank->correct_answers) {
                $numCorrect++;
            }
            if ($itemInstance->answer == null) {
                $complete = false;
            }
        }

        // if all questions are answered set the end time
        if ($complete) {
            $testInstance->end_time = Carbon::now();
        }

        $testInstance->score = $numCorrect;
        $saved = $testInstance->save();

        return array("saved"=>$saved, "numCorrect" => $numCorrect);
    }

    /**
     * @param Illuminate\Http\Request $request with 1 field:
     * id: int -> TestInstance id to grade
     * @return Illuminate\Http\Response
     */
    public function grade(Request $request) {
        // $data = $this->gradeTest($request->id);
        // if ($data['saved']) {
        //     return response("Num Correct: " . $data["numCorrect"], 200);
        // } else {
        //     App::abort(500, "Error");
        // }
        return $this->gradeTest(1);
    }

    /**
     * @param Illuminate\Http\Request $request -> POST request with 4 fields: 
     * answer: String -> option choice to be saved
     * itemInstaceId: int -> id of ItemInstance model to update
     * @return Illuminate\Http\Response
     */
    public function saveAnswerChoice(Request $request) {
        // save answer
        $itemInstance = ItemInstance::find($request->itemInstanceId);
        $itemInstance->end_time = Carbon::now();
        $itemInstance->answer = $request->answer;
        $saved = $itemInstance->save();

        // if ($request->correct) {
        //     $testInstance->score = $testInstance->score + 1;
        // }

        if ($saved) {
            $graded = $this->gradeTest($itemInstance->test_instance_id);
            if ($graded["saved"]) {
                return response("Saved and Graded Successfully! " . $graded['numCorrect'], 200);
            }
        } else {
            App::abort(500, "Couldn't save");
        }
    }

    /**
     * @param Illuminate\Http\Request $request -> POST request
     * itemInstanceId -> id of ItemInstance to start timer
     * @return Illuminate\Http\Response 
     */
    public function startItemInstanceTimer(Request $request) {
        $itemInstanceId = $request->itemInstanceId;
        $itemInstance = ItemInstance::find($itemInstanceId);
        if ($itemInstance->start_time == null) {
            $saved = $this->startItemInstance($request->itemInstanceId);
            if ($saved) {
                return response('Saved Sucessfully', 200);
            } else {
                App::abort(500, "Couldn't save");
            }
        } else {
            return response('Already Saved', 202);
        }
        
    }

    /**
     * @param int $id -> ItemInstance id to save
     * @return boolean $saved -> if ItemInstance was saved successfully
     */
    private function startItemInstance($id) {
        $itemInstance = ItemInstance::find($id);
        $itemInstance->start_time = Carbon::now();
        return $itemInstance->save();
    }
}
