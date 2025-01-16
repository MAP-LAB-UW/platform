<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
//use Illuminate\Http\Response;
use App\ItemBank;
use App\ItemTag;
use App\TagItemRel;
use App\QuestionEntity;
use App\OptionEntity;

class ItemBankController extends Controller
{
    /**
     * display all questions and their corresponding topics
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $res = [];
        $itemBankRows = ItemBank::take(40)->get();
        if ($itemBankRows -> isNotEmpty()) {
            foreach($itemBankRows as $row) {
                // get tag_name
                $itemBankId = $row -> id;
                $tags = TagItemRel::where('item_id','=', $itemBankId)->get();
                $topics = [];
                foreach($tags as $tag) {
                    $topic = ItemTag::find($tag->tag_id);
                    array_push($topics, $topic->tag_name);
                }
                // get question body
                $questionEntityId = $row -> question_entity_id;
                $questionText = QuestionEntity::find($questionEntityId)->question;
                array_push($res, array("topics" => $topics, "questionText" => $questionText, 
                "key" => $questionEntityId, "imageLink"=>$row->image));
            }
        }
        return response()->json($res);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        tap($this->validate($request, [
            "questionBody" => "required",
            'topics' => 'required|string',
            'correctAnswer' => 'required',
            'choices'=>'required|string'
        ]), function() use(&$request) {
            if ($request->hasFile('image')) {
                $this->validate($request, [
                    'image' => 'file|image|max:5000', // make sure file is an image of size <= 5 MB
                ]);
            }
        });

        $data = $request->all();

        $questionEntity = new QuestionEntity();
        $questionEntity->question = $data['questionBody'];
        $questionEntity->save();
        
        $itemBank = new ItemBank();
        $itemBank->question_entity_id = $questionEntity->id;
        $itemBank->correct_answers = $data['correctAnswer'];
        // var_dump($data['image']);
        // dd($data['image']);
        if ($data['image'] !== "noImage") {
            // remember to run php artisan storage:link to be able to publicly access images
            // images can be access from /storage/uploads/{image-name}
            $itemBank->image = $data['image']->store('uploads', 'public');
        }
        $itemBank->save();

        $choices = json_decode($data['choices'], true);
        foreach($choices as $choice) {
            $optionEntity = new OptionEntity();
            $optionEntity->choice = $choice["text"];
            $optionEntity->choice_label = $choice["key"];
            $optionEntity->item_id = $itemBank->id;
            $optionEntity->save();
        }

        $topics = json_decode($data['topics'], true);
        foreach($topics as $topic) {
            $tagItemRel = new TagItemRel();
            $tagItemRel->item_id = $itemBank->id;
            // check if tag name exists
            $itemTag = ItemTag::where('tag_name', '=', $topic)->first();
            if ($itemTag === null) {
                // make a new ItemTag model and link it to the TagItemRel model
                $itemTag = new ItemTag();
                $itemTag->tag_name = $topic;
                $itemTag->save();
            }
            $tagItemRel->tag_id = $itemTag->id;
            $tagItemRel->save();
        }

        return $itemBank;
    }

    /**
     * filter the questions by the specified topic
     * @param string $topic
     */
    public function searchByTopic($topic) {
        // get corresponding tag_ids from search
        $tag_ids = [];
        $itemTags = ItemTag::where('tag_name', 'like', '%' . $topic . '%')->get();
        foreach($itemTags as $itemTag) {
            array_push($tag_ids, $itemTag->id);
        }

        // get ItemBank Model corresponding to the tag_ids
        $itemBankIds = array();
        foreach($tag_ids as $id) {
            $tagItemRels = TagItemRel::where('tag_id', '=', $id)->get();
            foreach($tagItemRels as $tagItemRel) {
                array_push($itemBankIds, $tagItemRel->item_id);
            }
        }
        $itemBankIds = array_unique($itemBankIds);
        // format results and return them
        $res = array();
        foreach($itemBankIds as $itemId) {
            // get tag_name
            $tags = TagItemRel::where('item_id','=', $itemId)->get();
            $topics = [];
            foreach($tags as $tag) {
                $topic = ItemTag::find($tag->tag_id)->tag_name;
                array_push($topics, $topic);
            }
            // get question body
            $questionEntityId = ItemBank::find($itemId)->question_entity_id;
            $questionText = QuestionEntity::find($questionEntityId)->question;
            array_push($res, array("topics" => $topics, "questionText" => $questionText, 
            "key" => $questionEntityId));
        }
        return $res;
    }

    /**
     * get the question and its relationships for a specified question_entity_id
     * @param string $question_entity_id
     */
    public function getQuestion($question_entity_id) {
        $res = [];

        // get correct answer
        $itemBank = ItemBank::where('question_entity_id', '=', $question_entity_id)->get()->first();
        $correctAnswer = $itemBank->correct_answers;
        $res["correct_answer"] = $correctAnswer;

        // get question
        $question = QuestionEntity::find($question_entity_id);
        $res["questionBody"] = $question->question;

        // get topics
        $tagItemRels = TagItemRel::where('item_id', '=', $itemBank->id)->get();
        $topics = [];
        foreach($tagItemRels as $tagItemRel) {
            $tagItem = ItemTag::find($tagItemRel->tag_id);
            $topic = $tagItem->tag_name;
            array_push($topics, $topic);
        }
        $res['topics'] = $topics;

        // get options
        $options = OptionEntity::where('item_id', '=', $itemBank->id)->get();
        $choices = [];
        foreach($options as $option) {
            // $res["choice" . $option->choice_label] = $option->choice;
            $choices[$option->choice_label] = $option->choice;
        }
        $res['choices'] = $choices;

        $res['imageLink'] = $itemBank->image;
        return $res;
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id -> question_entity_id in ItemBank Model
     */
    public function update(Request $request, $id)
    {
        tap($this->validate($request, [
            "questionBody" => "required",
            'topics' => 'required|string',
            'correctAnswer' => 'required',
            'choices'=>'required|string'
        ]), function() use(&$request) {
            if ($request->hasFile('image')) {
                $this->validate($request, [
                    'image' => 'file|image|max:5000', // make sure file is an image of size <= 5 MB
                ]);
            }
        });

        $data = $request->all();

        // get question entity model and change the question field if needed
        $questionEntity = QuestionEntity::find($id);
        $questionBody = $data['questionBody'];
        if ($questionEntity->question !== $questionBody) {
            $questionEntity->question = $questionBody;
            $questionEntity->save();
        }
        
        // get item_bank model and change the correct_answers field if needed
        $itemBank = ItemBank::where('question_entity_id', '=', $id)->get()->first();
        $correctAnswer = $data['correctAnswer'];
        if ($correctAnswer !== $itemBank->correct_answers) {
            $itemBank->correct_answers = $correctAnswer;
            $itemBank->save();
        }

        // update image if needed
        if ($data['image'] != null && $data['image'] != "null") {
            $itemBank->image = $data['image']->store('uploads', 'public');
            $itemBank->save();
        }
        
        // update options
        $item_id = $itemBank->id;
        $choices = json_decode($data['choices'], true);
        var_dump($choices);
        foreach($choices as $choice) {
            // check if option exists and get it
            $optionEntity = OptionEntity::where([
                ['item_id', '=', $item_id],
                ['choice_label', '=', $choice['key']]
            ])->get()->first();

            // option already exists
            if ($optionEntity !== null) {
                if ($optionEntity->choice !== $choice['text']) {
                    $optionEntity->choice = $choice['text'];
                    $optionEntity->save();
                }
                // dont save if option
            } else { // option doesnt exist yet
                $optionEntity = new OptionEntity();
                $optionEntity->choice_label = $choice['key'];
                $optionEntity->item_id = $item_id;
                $optionEntity->choice = $choice['text'];
                $optionEntity->save();
            }
            $this->deleteUnusedOptionEntities($choices, $item_id);
        }

        $tagItemRels = TagItemRel::where('item_id', '=', $item_id)->get();
        $topics = json_decode($data['topics'], true);
        foreach($topics as $topic) {
            // check if topic has a corresponding TagItemRel
            if (!$this->checkIfTagItemRelExists($tagItemRels, $topic)) {
                $tagItemRel = new TagItemRel();
                $tagItemRel->item_id = $item_id;

                // check if there's an existing tag_name equal to topic
                $itemTag = ItemTag::where('tag_name', '=', $topic)->get()->first();
                if ($itemTag !== null && $itemTag->tag_name === $topic) {
                    // link TagItemRel to existing ItemTag
                    $tagItemRel->tag_id = $itemTag->id;
                } else { // make new ItemTag and link it to TagItemRel
                    $itemTag = new ItemTag();
                    $itemTag->tag_name = $topic;
                    $itemTag->save();
                    $tagItemRel->tag_id = $itemTag->id;
                }
                $tagItemRel->save();
            }
        }

        $this->deleteOldTagItemRels($topics, $item_id);
    }

    /**
     * @param array[string] $choices
     * @param int $item_id
     * Deletes OptionEntity models that are no longer used after a user updates a question
     */
    private function deleteUnusedOptionEntities($choices, $item_id) {
        $optionEntities = OptionEntity::where('item_id', '=', $item_id)->get();
        foreach($optionEntities as $option) {
            if (!$this->optionIsUsed($option, $choices)) {
                $option->delete();
            }
        }
    }

    /**
     * @param App\OptionEntity $option
     * @param array[string] $choices
     * checks if a given option is still in use after a user updates a question
     */
    private function optionIsUsed($option, $choices) {
        // var_dump($choices);
        foreach($choices as $choice) {
            if ($option->choice_label === $choice['key']) {
                return true;
            }
        }
        return false;
    }

    /**
     * @param string $topic
     * @param Collection $tagItemRels
     * For a given collection of TagItemRels, check to see if there exists a TagItemRel
     * such that the TagItemRel's corresponding ItemTag model has a tag_name field that matchs the given
     * topic
     * @return boolean
     */
    private function checkIfTagItemRelExists($tagItemRels, $topic) {
        foreach($tagItemRels as $tagItemRel) {
            $itemTag = ItemTag::find($tagItemRel->tag_id)->tag_name;
            if ($itemTag === $topic) {
                return true;
            }
        }
        return false;
    }

    /**
     * @param array[string] $topics
     * @param string $otherTopic
     * checks to see where a given topic exists in a newly updated array of topics for a question
     */
    private function topicExistsInChoices($topics, $otherTopic) {
        foreach($topics as $topic) {
            if ($topic === $otherTopic) {
                return true;
            }
        }
        return false;
    }

    /**
     * @param array $topics
     * @param int $item_id
     * deletes unused TagItemRel instances after a user updates a questions
     */
    private function deleteOldTagItemRels($topics, $item_id) {
        $tagItemRels = TagItemRel::where('item_id', '=', $item_id)->get();
        foreach($tagItemRels as $tagItemRel) {
            $itemTag = ItemTag::find($tagItemRel->tag_id)->tag_name;
            if (!$this->topicExistsInChoices($topics, $itemTag)) {
                $tagItemRel->delete();
            }
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
