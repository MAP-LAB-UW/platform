<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class QuestionEntity extends Model
{
    // table name
    protected $table = 'question_entity';

    // disable default timestamps
    public $timestamps = false;

    public function itemBank() {
        return $this->belongsTo('App\ItemBank', 'question_entity_id', 'id');
    }
}
