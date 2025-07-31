<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Project;

class ProjectController extends Controller
{
    public function index(Request $request)
    {
        // Liste tous les projets de l'utilisateur ou tout si admin
        $user = $request->user();
        if ($user->role === 'admin') {
            $projects = Project::with('tasks')->get();
        } else {
            $projects = Project::where('owner_id', $user->id)->with('tasks')->get();
        }
        return response()->json($projects);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'deadline' => 'nullable|date',
            'budget' => 'nullable|numeric|min:0',
            'status' => 'nullable|string|in:pending,in_progress,completed',
        ]);

        $project = Project::create([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'deadline' => $validated['deadline'] ?? null,
            'budget' => $validated['budget'] ?? null,
            'status' => $validated['status'] ?? 'pending',
            'owner_id' => $request->user()->id,
        ]);

        return response()->json($project, 201);
    }

    public function show($id, Request $request)
    {
        $project = Project::with(['tasks.assignedUser', 'tasks.comments.user'])->findOrFail($id);

        // Vérifier que l'utilisateur a accès
        if ($request->user()->role !== 'admin' && $project->owner_id !== $request->user()->id) {
            return response()->json(['message' => 'Accès refusé'], 403);
        }

        return response()->json($project);
    }

    public function update($id, Request $request)
    {
        $project = Project::findOrFail($id);

        if ($request->user()->role !== 'admin' && $project->owner_id !== $request->user()->id) {
            return response()->json(['message' => 'Accès refusé'], 403);
        }

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $project->update($validated);

        return response()->json($project);
    }

    public function destroy($id, Request $request)
    {
        $project = Project::findOrFail($id);

        if ($request->user()->role !== 'admin' && $project->owner_id !== $request->user()->id) {
            return response()->json(['message' => 'Accès refusé'], 403);
        }

        $project->delete();

        return response()->json(['message' => 'Projet supprimé']);
    }
}
