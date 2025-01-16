<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class TagTestRel extends Model
{
    // table name
    protected $table = "tag_test_rel";

    public $timestamps = false;

    protected $fillable = ['test_id', 'tag_id'];
}
