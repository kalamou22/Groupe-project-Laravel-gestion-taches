<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class IsAdmin
{
    public function handle(Request $request, Closure $next): Response
    {
        // Vérifie si l'utilisateur est authentifié et a le rôle admin
        if (auth()->check() && auth()->user()->role === 'admin') {
            return $next($request);
        }

        return response()->json(['message' => 'Accès refusé. Admins seulement.'], 403);
    }
}
