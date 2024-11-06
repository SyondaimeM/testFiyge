<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\FormController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/test', function () {
    return response()->json([
        'message' => 'API is working properly!',
        'status' => 'success',
        'data' => [],
    ], 200); // 200 OK status
});

    Route::post('/forms/save', [FormController::class, 'save']);
    Route::get('/forms/{id}', [FormController::class, 'fetch']);
    Route::put('/forms/update/{id}', [FormController::class, 'update']);
    Route::get('/lists', [FormController::class, 'lists']);


