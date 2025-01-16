<?php
use Illuminate\Database\Seeder;
use App\User;
use Illuminate\Support\Facades\Hash;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
      //Add this lines
        User::query()->truncate(); // truncate user table each time of seeders run
        User::create([ // create a new teacher user
            'email' => 'admin@admin.com',
            'password' => Hash::make('admin'),
            'user_type' => 'teacher',
            'name' => 'Administrator'
        ]);
        User::create([ // create a new student user
            'email' => 'student@student.com',
            'password' => Hash::make('student'),
            'user_type' => 'student',
            'name' => 'Student'
        ]);
    }
}