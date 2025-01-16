<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ItemInstance extends Model
{
    // table to model
    protected $table = 'item_instance';

    // everything is fillable
    protected $guarded = [];

    // don't use default timestamps
    public $timestamps = false;

    // recognize these columns as timestamps
    protected $dates = ['start_time', 'end_time'];
}
