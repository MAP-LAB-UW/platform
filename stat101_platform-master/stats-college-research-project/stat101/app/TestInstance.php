<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class TestInstance extends Model
{
    // table to model
    protected $table = 'test_instance';

    // everything is fillable
    protected $fillable = ['student_id', 'score'];

    // don't use default timestamps
    public $timestamps = false;

    // recognize these columns as timestamps
    protected $dates = ['start_time', 'end_time'];
}
