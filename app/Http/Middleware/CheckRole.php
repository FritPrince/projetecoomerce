<?php
// app/Http/Middleware/CheckRole.php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class CheckRole
{
    public function handle(Request $request, Closure $next, string $role): Response
    {
        // Vérifier si l'utilisateur est authentifié
        if (!Auth::check()) {
            return redirect()->route('login');
        }

        /** @var \App\Models\User $user */
        $user = Auth::user();
        
        // Vérification des rôles
        if ($role === 'admin' && !$user->isAdmin()) {
            abort(403, 'Accès réservé aux administrateurs.');
        }

        if ($role === 'client' && !$user->isClient()) {
            abort(403, 'Accès réservé aux clients.');
        }

        return $next($request);
    }
}