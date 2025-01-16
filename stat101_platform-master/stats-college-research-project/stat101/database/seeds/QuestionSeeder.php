<?php

use Illuminate\Database\Seeder;
use App\QuestionEntity;
use App\ItemBank;
use App\TagItemRel;
use App\ItemTag;
use App\OptionEntity;

class QuestionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // make ItemTag models
        $topics = ["Normal Curves", "Alpha", "Beta"];
        foreach($topics as $topic) {
            ItemTag::create(['tag_name' => $topic]);
        }

        // make QuestionEntity models
        $questions = ["This is the first sample question!", "This is the second sample question!"];
        foreach ($questions as $question) {
            QuestionEntity::create(['question' => $question]);
        }

        // make ItemBank models
        ItemBank::create(['question_entity_id' => 1, 'correct_answers' => 'b']);
        ItemBank::create(['question_entity_id' => 2, 'correct_answers' => 'a']);

        // make TagItemRel models
        for ($i = 1; $i <= 2; $i++) {
            for ($j = 1; $j <= 3; $j++) {
                TagItemRel::create(['tag_id' => $j, 'item_id' => $i]);
            }
        }

        // make OptionEntity models
        $labels = ['a','b','c','d'];
        for ($i = 1; $i <= 2; $i++) {
            foreach ($labels as $label) {
                OptionEntity::create(['item_id' => $i, 'choice' => 'blah' . $label, 'choice_label' => $label]);
            }
        }
    }
}
