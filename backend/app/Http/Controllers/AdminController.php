<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Project;
use App\Models\Task;
use App\Models\Comment;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    public function index()
    {
        // Statistiques générales
        $stats = [
            'total_users' => User::count(),
            'total_projects' => Project::count(),
            'total_tasks' => Task::count(),
            'total_comments' => Comment::count(),
            'pending_tasks' => Task::where('status', 'pending')->count(),
            'in_progress_tasks' => Task::where('status', 'in_progress')->count(),
            'completed_tasks' => Task::where('status', 'done')->count(),
        ];

        // Projets récents
        $recent_projects = Project::with('owner')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        // Tâches en retard
        $overdue_tasks = Task::with(['project', 'assignedUser'])
            ->where('deadline', '<', now())
            ->where('status', '!=', 'done')
            ->get();

        return response()->json([
            'stats' => $stats,
            'recent_projects' => $recent_projects,
            'overdue_tasks' => $overdue_tasks,
        ]);
    }

    public function users()
    {
        $users = User::withCount(['projects', 'assignedTasks'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($users);
    }

    public function userStats($userId)
    {
        $user = User::findOrFail($userId);
        
        $stats = [
            'user' => $user,
            'projects_owned' => $user->projects()->count(),
            'tasks_assigned' => $user->assignedTasks()->count(),
            'tasks_by_status' => [
                'pending' => $user->assignedTasks()->where('status', 'pending')->count(),
                'in_progress' => $user->assignedTasks()->where('status', 'in_progress')->count(),
                'done' => $user->assignedTasks()->where('status', 'done')->count(),
            ],
            'recent_tasks' => $user->assignedTasks()
                ->with('project')
                ->orderBy('created_at', 'desc')
                ->limit(10)
                ->get(),
        ];

        return response()->json($stats);
    }

    public function projects()
    {
        $projects = Project::with(['owner', 'tasks'])
            ->withCount('tasks')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($projects);
    }

    public function projectStats($projectId)
    {
        $project = Project::with(['owner', 'tasks.assignedUser'])
            ->findOrFail($projectId);

        $stats = [
            'project' => $project,
            'total_tasks' => $project->tasks()->count(),
            'tasks_by_status' => [
                'pending' => $project->tasks()->where('status', 'pending')->count(),
                'in_progress' => $project->tasks()->where('status', 'in_progress')->count(),
                'done' => $project->tasks()->where('status', 'done')->count(),
            ],
            'progress_percentage' => $project->tasks()->count() > 0 
                ? round(($project->tasks()->where('status', 'done')->count() / $project->tasks()->count()) * 100, 2)
                : 0,
            'overdue_tasks' => $project->tasks()
                ->where('deadline', '<', now())
                ->where('status', '!=', 'done')
                ->count(),
        ];

        return response()->json($stats);
    }

    public function tasks()
    {
        $tasks = Task::with(['project', 'assignedUser'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($tasks);
    }

    public function globalStats()
    {
        // Statistiques avancées
        $monthlyStats = Task::selectRaw('
            MONTH(created_at) as month,
            YEAR(created_at) as year,
            COUNT(*) as total_tasks,
            SUM(CASE WHEN status = "done" THEN 1 ELSE 0 END) as completed_tasks
        ')
        ->whereYear('created_at', date('Y'))
        ->groupBy('year', 'month')
        ->orderBy('year')
        ->orderBy('month')
        ->get();

        $userWorkload = User::withCount(['assignedTasks as total_tasks'])
            ->withCount(['assignedTasks as pending_tasks' => function($query) {
                $query->where('status', 'pending');
            }])
            ->withCount(['assignedTasks as in_progress_tasks' => function($query) {
                $query->where('status', 'in_progress');
            }])
            ->get();

        return response()->json([
            'monthly_stats' => $monthlyStats,
            'user_workload' => $userWorkload,
        ]);
    }
}
