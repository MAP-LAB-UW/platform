<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\TestBank;
use Carbon\Carbon;
use App\TestItemRel;
use App\ItemBank;
use App\TagTestRel;
use App\ItemTag;
use App\TestInstance;
use DateTime;

class TestBankController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $res = [];
        $tests = TestBank::take(20)->get();
        foreach($tests as $test) {
            $returnTest = [];
            $returnTest['id'] = $test->id;
            $returnTest['name'] = $test->test_name;
            
            $topics = [];
            $tagTestRels = TagTestRel::where('test_id', '=', $test->id)->get();
            foreach ($tagTestRels as $rel) {
                $topic = ItemTag::where('id', '=', $rel->tag_id)->get()->first()->tag_name;
                array_push($topics, $topic);
            }
            $returnTest['topics'] = $topics;

            $returnTest['time'] = $test->last_updated_time->format('m/d/Y'); 
            array_push($res, $returnTest);
        }
        return $res;
    }

    /**
     * @param Request $request -> post request with student id data
     * @return array[] $res
     * get a list of all published tests with their id, name, and due date
     */
    public function getPublishedTests(Request $request) {
        $res = [];

        $studentId = $request->id;

        $publishedTests = TestBank::where('status', '=', 'published')->get();
        $startedTests = TestInstance::where([
            ['student_id', '=', $studentId],
            ['status', '=', 'in_progress'],
        ])->get();

        foreach($publishedTests as $test) {
            $date =  Carbon::createFromFormat('Y-m-d H:i:s', $test->end_time)->format('g:ia, l F jS Y');
            $isStarted = $this->isTestStarted($test->id, $startedTests);
            array_push($res, ["id"=>$test->id, "name"=>$test->test_name, "due_date"=>$date, "started"=>$isStarted]);
        }

        return $res;
    }

    /**
     * @param Collection $startedTests
     * @param int $testId
     */
    private function isTestStarted($testId, $startedTests) {
        foreach($startedTests as $test) {
            if ($testId == $test->test_id) {
                return true;
            }
        }
        return false;
    }

    /**
     * @param  \Illuminate\Http\Request $request
     * @param int $id 
     * @return \Illuminate\Http\Response
     * publishes the given test
     */
    public function publish(Request $request, $id) {
        $data = $request->all();

        $test = TestBank::find($id);
        $test->status = 'published';

        $startTime = new DateTime(str_replace("(Pacific Daylight Time)", "", $data['startTime']));
        $endTime = new DateTime(str_replace("(Pacific Daylight Time)", "", $data['endTime']));

        $test->start_time = $startTime;
        $test->end_time =  $endTime;

        $test->save();
        return TestBank::find($id);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        // get all data in an object
        $data = $request->all();
        
        // set inital TestBank model fields
        $testBank = new TestBank();
        $testBank->test_name = $data['testName'];
        $testBank->status = 'draft';
        $testBank->last_updated_time = Carbon::now();
        $testBank->start_time = null;
        $testBank->end_time = null;
        $testBank->teacher_id = $data['teacher_id']; 
        $testBank->save();
        // $testBank->topic = $data['topic'];
        foreach ($data['topics'] as $topic) {
            // check if topic already exists
            $tagTestRel = new TagTestRel();
            $itemTag = ItemTag::where('tag_name', '=', $topic)->first();
            if ($itemTag === null) {
                // make a new ItemTag model
                $itemTag = new ItemTag();
                $itemTag->tag_name = $topic;
                $itemTag->save();
            }
            $tagTestRel->tag_id = $itemTag->id;
            $tagTestRel->test_id = $testBank->id;
            $tagTestRel->save();
        }

        foreach($data['questions'] as $questionEntityId) {
            // get related ItemBank model id
            $itemBankId = ItemBank::where('question_entity_id', '=', $questionEntityId)->get()->first()->id;

            // set initial TestItemRel model fields and save it
            $testItemRel = new TestItemRel();
            $testItemRel->item_id = $itemBankId;
            $testItemRel->test_id = $testBank->id;
            $testItemRel->save();
        }

        return array("test"=>TestBank::find($testBank->id), "tags"=>TagTestRel::where('test_id', '=', $testBank->id)->get());
    }

    /**
     * get test information for a specific test id
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function find($id) {
        $res = [];

        // get corresponding TestBank model and assign response test name and topic fields
        $testBankModel = TestBank::find($id);
        $res['name'] = $testBankModel->test_name;
        $res['topics'] = [];
        // $res['topic'] = $testBankModel->topic;

        $tagTestRels = TagTestRel::where('test_id', '=', $id)->get();
        foreach($tagTestRels as $tagTestRel) {
            $tag = ItemTag::find($tagTestRel->tag_id);
            array_push($res['topics'], $tag->tag_name);
        }

        $testItemRels = TestItemRel::where('test_id', '=', $testBankModel->id)->get();

        // find all corresponding question_entity_ids
        $questionEntityIds = [];
        foreach($testItemRels as $testItemRel) {
            $itemId = $testItemRel->item_id;
            $itemBank = ItemBank::find($itemId);
            array_push($questionEntityIds, $itemBank->question_entity_id);
        }
        $res['question_entity_ids'] = $questionEntityIds;

        return $res;
    }

    /**
     * check whether a test is published or not
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function checkPublished($id) {
        $status = TestBank::find($id)->status;
        return $status;
    }

    /**
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function unPublish(Request $request, $id) {
        $testBank = TestBank::find($id);
        $testBank->status = 'draft';
        $testBank->save();
    }


    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        
        $data = $request->all();
        // var_dump($data);
        // set inital TestBank model fields
        $testBank = TestBank::find($id);
        
        $topics = $data['topics'];
        foreach($topics as $topic) {
            // check if topic already has an ItemTag
            $itemTag = ItemTag::where('tag_name', '=', $topic)->get()->first();
            if ($itemTag != null) { // ItemTag exists
                $tagTestRel = TagTestRel::where('tag_id', '=', $itemTag->id)->get()->first();
                // check if there's a TagTestRel with that topic
                if ($tagTestRel == null) { // make a new TagTestRel with that topic
                    $tagTestRel = new TagTestRel();
                    $tagTestRel->test_id = $testBank->id;
                    $tagTestRel->tag_id = $itemTag->id;
                    $saved = $tagTestRel->save();
                    if (!$saved) {
                        App::abort(500, "Error saving TagTestRel");
                    }
                } // don't do anything if there already exists a TagTestRel for that topic
            } else { // there isnt an ItemTag model for that topic

                // make new ItemTag model for the topic
                $itemTag = new ItemTag();
                $itemTag->tag_name = $topic;
                $saved = $itemTag->save();
                if (!$saved) {
                    App::abort(500, "Error making new ItemTag");
                }

                // make a new TagTestRel for that topic
                $tagTestRel = new TagTestRel();
                $tagTestRel->tag_id = $itemTag->id;
                $tagTestRel->test_id = $testBank->id;
                $saved = $tagTestRel->save();
                if (!$saved) {
                    App::abort(500, "Error saving new TagTestRel");
                }
            }
        }

        // get all TagTestRels for this TestBank model and delete unneeded ones
        $tagTestRels = TagTestRel::where('test_id', '=', $testBank->id)->get();
        foreach($tagTestRels as $tagTestRel) {
            // get topic
            $topic = ItemTag::find($tagTestRel->tag_id)->tag_name;
            if (!in_array($topic, $topics)) {
                $tagTestRel->delete();
            }
        }

        $testBank->test_name = $data['testName'];
        $testBank->last_updated_time = Carbon::now();
        $testBank->save();

        // get all TestItemRel models for the test
        $testItemRels = TestItemRel::where('test_id', '=', $id)->get();

        // get all corresponding ItemBank model ids for the passed $questionEntityIds
        $itemBankIds = [];
        foreach($data['questions'] as $questionEntityId) {
            $itemBankId = ItemBank::where('question_entity_id', '=', $questionEntityId)->get()->first()->id;
            array_push($itemBankIds, $itemBankId);
        }

        // find questions that are no longer in the test and remove them
        foreach($testItemRels as $testItemRel) {
            $testItemRelItemId = $testItemRel->item_id;
            if (in_array($testItemRelItemId, $itemBankIds)) {
                // remove ids from $itemBankIds if the questions does not need to be deleted
                $keyToDelete = array_search($testItemRelItemId, $itemBankIds);
                unset($itemBankIds[$keyToDelete]);
            } else {
                TestItemRel::find($testItemRel->id)->delete();
            }
        }

        // save new questions added to test
        foreach($itemBankIds as $itemBankId) {
            // set initial TestItemRel model fields and save it
            $testItemRel = new TestItemRel();
            $testItemRel->item_id = $itemBankId;
            $testItemRel->test_id = $id;
            $testItemRel->save();
        }

        return response(TagTestRel::where('test_id', '=', $testBank->id)->get(), 200);
    }

    /**
     * get tests with topic
     * @param $request Illuminate\Http\Request -> POST request with fields:
     * topic -> String -> topic to filter tests by
     * @return Illuminate\Http\Response  
     */
    public function filter(Request $request) {
        $topic = $request->topic;

        // get ItemTag id
        $itemTags = ItemTag::where('tag_name', 'like', "%" . $topic . "%")->get();

        // get TestBank models corresponding to the $itemTag ids
        $res = [];
        foreach($itemTags as $itemTag) {
            // find TagTestRel model
            $tagTestRels = TagTestRel::where('tag_id', '=', $itemTag->id)->get();
            if ($tagTestRels != null) { // if a TagTestRel model exists for a given topic
                foreach($tagTestRels as $tagTestRel) {
                    $testBank = TestBank::where('id', '=', $tagTestRel->test_id)->get()->first();
                    if (!$this->testIsAlreadyInRes($res, $testBank->id)) {
                        // get topics for TestBank model
                        $testBankTagItemRels = TagTestRel::where('test_id', '=', $testBank->id)->get();
                        $testBankTopics = [];
                        foreach ($testBankTagItemRels as $rel) {
                            $topic = ItemTag::find($rel->tag_id)->tag_name;
                            array_push($testBankTopics, $topic);
                        }
                        $test = array("id" => $testBank->id, "name"=>$testBank->test_name, "topics"=>$testBankTopics, 
                            "time"=>$testBank->last_updated_time->format('m/d/Y'));
                        array_push($res, $test);  
                    }
                } 
            }
        }

        return response($res, 200);
    }

    /**
     * check if a given test id already exists in side return array
     * helper function for filter method
     * @param array $res -> array to search
     * @param int $id -> test id to search for
     */
    private function testIsAlreadyInRes($res, $id) {
        if (count($res) != 0) {
            foreach($res as $test) {
                if ($test["id"] == $id) {
                    return true;
                }
            }
        }
        return false;
    }
}
