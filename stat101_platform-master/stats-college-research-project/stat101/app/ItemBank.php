<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ItemBank extends Model
{
    // table name
    protected $table = "item_bank";

    // do no use default timestamp fields
    public $timestamps = false;

    // item_bank relationships to other Models/tables

    public function questionEntity() {
        return $this->hasOne('App\QuestionEntity', 'question_entity_id', 'id');
    }

    public function optionEntity() {
        return $this->hasMany('App\OptionEntity', 'item_id', 'id');
    }

    public function tagItemRel() {
        return $this->hasOne('App\TagItemRel', 'item_id', 'id');
    }

    public function itemTag() {
        return $this->hasOneThrough(
            'App\ItemTag',
            'App\TagItemRel',
            'item_id',
            'id',
            'id',
            'tag_id'
        );
    }
}
