<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class TagItemRel extends Model
{
    // table name
    protected $table = "tag_item_rel";
    
    protected $fillable = ['tag_id', 'item_id'];

    // disable default timestamps
    public $timestamps = false;

    // tag_item_rel relationships with other Models/tables
    public function itemTag() {
        return $this->hasOne('App\ItemTag', 'id', 'tag_id');
    }

    public function itemBank() {
        return $this->belongsTo('App\ItemBank', 'item_id', 'id');
    }
}
