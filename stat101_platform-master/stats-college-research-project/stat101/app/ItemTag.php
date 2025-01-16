<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ItemTag extends Model
{
    // table name
    protected $table = "item_tag";

    // disable default timestamps
    public $timestamps = false;

    // item_tag relationships to other Models/tables

    public function tagItemRel() {
        return $this->belongsTo('tag_item_rel', 'tag_id', 'id');
    }
}
