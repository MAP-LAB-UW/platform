<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\User;

class APILoginController extends Controller
{
    
    // register a new user
    public function register(Request $request) {
        $user = User::create([
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'user_type' => strtolower($request->userType),
            'name' => $request->name
        ]);

        $user->sendEmailVerificationNotification();
        
        $token = auth('api')->login($user);

        return $this->respondWithToken($token);
    }

    // logout a user
    public function logout() {
        auth('api')->logout();

        return response()->json(['message' => 'Successfully logged out']);
    }

    public function login() {
        // get email and password from request
        $credentials = request(['email', 'password']);

        // get user information
        $user = User::where('email', '=', request('email'))->get()->first();
        
        // try to auth and get the token using api authentication
        if (!$token = auth('api')->attempt($credentials)) {
            // if the credentials are wrong we send an unauthorized error in json format
            return response()->json(['error' => 'make sure your email and password are correct.'], 401);
        }

        return response()->json([
            'token' => $token,
            'type' => 'bearer',
            'expires' => auth('api')->factory()->getTTL() * 60, // time to expiration
            'userType' => $user->user_type,
            'name' => $user->name,
            'user_id' => $user->id
        ]);
    }

    // return a jwt token
    protected function respondWithToken($token)
    {
        return response()->json([
            'access_token' => $token,
            'token_type'   => 'bearer',
            'expires_in'   => auth('api')->factory()->getTTL() * 60
        ]);
    }
}
