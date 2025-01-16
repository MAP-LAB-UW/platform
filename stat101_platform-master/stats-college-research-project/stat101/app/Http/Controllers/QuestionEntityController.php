<?php

namespace App\Http\Controllers;

use App\QuestionEntity;
use Illuminate\Http\Request;

class QuestionEntityController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $questions = QuestionEntity::all();
        return response()->json($questions);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\QuestionEntity  $questionEntity
     * @return \Illuminate\Http\Response
     */
    public function show(QuestionEntity $questionEntity)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\QuestionEntity  $questionEntity
     * @return \Illuminate\Http\Response
     */
    public function edit(QuestionEntity $questionEntity)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\QuestionEntity  $questionEntity
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, QuestionEntity $questionEntity)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\QuestionEntity  $questionEntity
     * @return \Illuminate\Http\Response
     */
    public function destroy(QuestionEntity $questionEntity)
    {
        //
    }
}
