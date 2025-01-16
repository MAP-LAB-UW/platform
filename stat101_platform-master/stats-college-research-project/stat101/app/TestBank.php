<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class TestBank extends Model
{
    // use test_bank model
    protected $table = 'test_bank';

    // don't update default timestamps
    public $timestamps = false;

    // add custom timestamp to dates
    protected $dates = ['last_updated_time', 'start_time', 'end_time'];

    protected $fillable = ['status', 'start_time', 'end_time'];

}
