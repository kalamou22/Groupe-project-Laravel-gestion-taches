<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Task;
use App\Models\Project;

class TaskController extends Controller
{
    public function index(Request $request)
    {
        $query = Task::with(['project', 'assignedUser', 'comments.user']);
        
        // Filtrage par projet
        if ($request->has('project_id')) {
            $query->where('project_id', $request->project_id);
        }
        
        // Filtrage par statut
        if ($request->has('etat')) {
            $query->where('etat', $request->etat);
        }
        
        // Filtrage par utilisateur assigné
        if ($request->has('assigned_to')) {
            $query->where('assigned_to', $request->assigned_to);
        }
        
        $tasks = $query->orderBy('created_at', 'desc')->get();
        
        return response()->json($tasks);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'titre' => 'required|string|max:255',
            'description' => 'nullable|string',
            'etat' => 'required|string|in:en attente,en cours,terminée',
            'deadline' => 'nullable|date',
            'project_id' => 'required|exists:projects,id',
            'assigned_to' => 'nullable|exists:users,id',
        ]);

        // Vérifier que l'utilisateur a accès au projet
        $project = Project::findOrFail($validated['project_id']);
        if ($project->owner_id !== auth()->id() && !auth()->user()->isAdmin()) {
            return response()->json(['message' => 'Accès non autorisé'], 403);
        }

        $task = Task::create($validated);

        return response()->json($task->load(['project', 'assignedUser']), 201);
    }

    public function show($id)
    {
        $task = Task::with(['project', 'assignedUser', 'comments.user'])
                   ->findOrFail($id);

        return response()->json($task);
    }

    public function update(Request $request, $id)
    {
        $task = Task::findOrFail($id);
        
        // Vérifier les permissions
        $project = $task->project;
        if ($project->owner_id !== auth()->id() && !auth()->user()->isAdmin()) {
            return response()->json(['message' => 'Accès non autorisé'], 403);
        }

        $validated = $request->validate([
            'titre' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|nullable|string',
            'etat' => 'sometimes|required|string|in:en attente,en cours,terminée',
            'deadline' => 'sometimes|nullable|date',
            'assigned_to' => 'sometimes|nullable|exists:users,id',
        ]);

        $task->update($validated);

        return response()->json($task->load(['project', 'assignedUser']));
    }

    public function destroy($id)
    {
        $task = Task::findOrFail($id);
        
        // Vérifier les permissions
        $project = $task->project;
        if ($project->owner_id !== auth()->id() && !auth()->user()->isAdmin()) {
            return response()->json(['message' => 'Accès non autorisé'], 403);
        }

        $task->delete();

        return response()->json(['message' => 'Tâche supprimée avec succès']);
    }
}
