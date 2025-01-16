<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class TestItemRel extends Model
{
    // use test_bank model
    protected $table = 'test_item_rel';

    // don't update default timestamps
    public $timestamps = false;
}
