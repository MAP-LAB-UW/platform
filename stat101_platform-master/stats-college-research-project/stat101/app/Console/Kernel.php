<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;
use App\TestInstance;
use App\TestBank;
use App\ItemInstance;
use App\ItemBank;

class Kernel extends ConsoleKernel
{
    /**
     * The Artisan commands provided by your application.
     *
     * @var array
     */
    protected $commands = [
        //
    ];

    /**
     * Define the application's command schedule.
     *
     * @param  \Illuminate\Console\Scheduling\Schedule  $schedule
     * @return void
     */
    protected function schedule(Schedule $schedule)
    {
        // $schedule->command('inspire')
        //          ->hourly();
        // $schedule->call($this->gradeAllTests())
        //          ->everyMinute();
    }

    /**
     * Register the commands for the application.
     *
     * @return void
     */
    protected function commands()
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }

    /**
     * @param int id -> id of TestInstance to grade
     * @return boolean $saved -> if the TestInstance was graded sucessfully
     * Called to grade a test and/or set the end time
     */
    private function endAndGradeTest($id) {
        $testInstanceId = $id;
        $testInstance = TestInstance::find($testInstanceId);
        $testInstance->end_time = Carbon::now();

        // get all ItemInstance models
        $itemInstances = ItemInstance::where('test_instance_id', '=', $testInstanceId)->get();
        $numCorrect = 0;

        foreach ($itemInstances as $itemInstance) {
            // find corresponding ItemBank model
            $itemBank = ItemBank::find($itemInstance->item_id);
            if ($itemInstance->answer == $itemBank->correct_answers) {
                $numCorrect++;
            }
        }
        $testInstance->score = $numCorrect;
        $saved = $testInstance->save();

        return $saved;
    }

    /**
     * Checks every published test to see if the test needs to be closed and graded
     * @return array[int] $gradedIds -> ids of tests that were closed and graded
     */
    private function gradeAllTests() {
        $publishedTests = TestBank::where('status', '=', 'published')->get();
        $gradedIds = [];
        foreach($publishedTests as $test) {
            // it is past the tests end time
            if ($test->end_time < Carbon::now()) {
                $testInstances = TestInstance::where('test_id', '=', $test->id)->get();
                foreach($testInstances as $testInstance) {
                    if ($testInstance->end_time != null) { // test has been graded already, don't regrade
                        $saved = $this->endAndGradeTest($testInstance->id);
                        if (!$saved) {
                            return "TestInstance with id " . $testInstance->id ."was not saved.";
                        }
                    }
                }
                $test->status = "draft";
                $test->save();
                array_push($gradedIds, $test->id);
            }
        }
        return $gradedIds;
    }
}
