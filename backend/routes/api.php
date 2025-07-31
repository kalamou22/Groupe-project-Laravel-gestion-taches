<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\TaskController;
use App\Http\Controllers\Api\CommentController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\AdminController;

// ✅ Test API
Route::get('/test', function () {
    return response()->json(['message' => 'API OK']);
});

// ✅ Auth (public)
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// ✅ Routes protégées (utilisateur connecté)
Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);
    
    // Profil utilisateur
    Route::get('/user', [UserController::class, 'profile']);
    Route::put('/user', [UserController::class, 'updateProfile']);
    Route::get('/users', [UserController::class, 'getAllUsers']);

    // Projets
    Route::apiResource('projects', ProjectController::class);
    
    // Tâches
    Route::get('/tasks', [TaskController::class, 'index']);
    Route::post('/tasks', [TaskController::class, 'store']);
    Route::get('/tasks/{id}', [TaskController::class, 'show']);
    Route::put('/tasks/{id}', [TaskController::class, 'update']);
    Route::delete('/tasks/{id}', [TaskController::class, 'destroy']);
    
    // Commentaires
    Route::get('/tasks/{id}/comments', [CommentController::class, 'index']);
    Route::post('/tasks/{id}/comments', [CommentController::class, 'store']);
    Route::put('/comments/{id}', [CommentController::class, 'update']);
    Route::delete('/comments/{id}', [CommentController::class, 'destroy']);

});

// ✅ Routes Admin (protégées par middleware admin)
Route::middleware(['auth:sanctum', 'is_admin'])->prefix('admin')->group(function () {
    
    Route::get('/', [AdminController::class, 'index']);
    Route::get('/stats', [AdminController::class, 'globalStats']);
    Route::get('/users', [AdminController::class, 'users']);
    Route::get('/users/{id}/stats', [AdminController::class, 'userStats']);
    Route::get('/projects', [AdminController::class, 'projects']);
    Route::get('/projects/{id}/stats', [AdminController::class, 'projectStats']);
    Route::get('/tasks', [AdminController::class, 'tasks']);
    
});
