<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class OptionEntity extends Model
{
    // use option_entity table
    protected $table = "option_entity";

    // disable default timestamps
    public $timestamps = false;

    // link to ItemBank Model
    public function itemBank() {
        return $this->belongsTo('App\ItemBank', 'item_id', 'id');
    }
}
