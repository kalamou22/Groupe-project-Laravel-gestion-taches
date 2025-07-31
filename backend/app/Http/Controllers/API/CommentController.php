<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Comment;
use App\Models\Task;

class CommentController extends Controller
{
    public function index($taskId)
    {
        $comments = Comment::with('user')
            ->where('task_id', $taskId)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($comments);
    }

    public function store(Request $request, $taskId)
    {
        // Vérifier que la tâche existe
        $task = Task::findOrFail($taskId);
        
        $validated = $request->validate([
            'content' => 'required|string|max:1000',
        ]);

        $comment = Comment::create([
            'texte' => $validated['content'],
            'auteur_id' => $request->user()->id,
            'task_id' => $taskId,
        ]);

        return response()->json($comment->load('user'), 201);
    }

    public function update(Request $request, $id)
    {
        $comment = Comment::findOrFail($id);
        
        // Vérifier que l'utilisateur est l'auteur du commentaire ou admin
        if ($comment->auteur_id !== auth()->id() && !auth()->user()->isAdmin()) {
            return response()->json(['message' => 'Accès non autorisé'], 403);
        }

        $validated = $request->validate([
            'content' => 'required|string|max:1000',
        ]);

        $comment->update(['texte' => $validated['content']]);

        return response()->json($comment->load('user'));
    }

    public function destroy($id)
    {
        $comment = Comment::findOrFail($id);
        
        // Vérifier que l'utilisateur est l'auteur du commentaire ou admin
        if ($comment->auteur_id !== auth()->id() && !auth()->user()->isAdmin()) {
            return response()->json(['message' => 'Accès non autorisé'], 403);
        }

        $comment->delete();

        return response()->json(['message' => 'Commentaire supprimé avec succès']);
    }
}
