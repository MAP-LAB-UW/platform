<?php

use Illuminate\Database\Seeder;
use App\TestBank;
use App\TestItemRel;
use App\TagTestRel;
use Carbon\Carbon;

class TestSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // make TestBank model
        TestBank::create(['test_name' => "Sample Test", 'status' => 'draft', 'teacher_id' => 1, 'last_updated_time' => Carbon::now()]);

        // make TestItemRel models
        TestItemRel::create(['item_id' => 1, 'test_id' => 1]);
        TestItemRel::create(['item_id' => 2, 'test_id' => 1]);

        // make TagTestRel models
        TagTestRel::create(['test_id' => 1, 'tag_id' => 1]);
        TagTestRel::create(['test_id' => 1, 'tag_id' => 2]);

    }
}
