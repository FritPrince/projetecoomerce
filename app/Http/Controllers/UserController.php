<?php
// app/Http/Controllers/UserController.php
namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function index()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        
        if (!$user->isAdmin()) {
            abort(403, 'Accès réservé aux administrateurs.');
        }
        
        $users = User::where('role', 'client')->get();
        return Inertia::render('Admin/Users/Index', ['users' => $users]);
    }

    public function create()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        
        if (!$user->isAdmin()) {
            abort(403, 'Accès réservé aux administrateurs.');
        }
        
        return Inertia::render('Admin/Users/Create');
    }

    public function store(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        
        if (!$user->isAdmin()) {
            abort(403, 'Accès réservé aux administrateurs.');
        }
        
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:8|confirmed',
            'telephone' => 'nullable|string|max:20',
            'adresse' => 'nullable|string',
        ]);

        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'client',
            'telephone' => $request->telephone,
            'adresse' => $request->adresse,
        ]);

        return redirect()->route('users.index')
                         ->with('success', 'Utilisateur créé avec succès.');
    }

    public function show(User $user)
    {
        /** @var \App\Models\User $currentUser */
        $currentUser = Auth::user();
        
        // Un admin peut voir tous les users, un client ne peut voir que son profil
        if (!$currentUser->isAdmin() && $currentUser->id !== $user->id) {
            abort(403, 'Non autorisé.');
        }
        
        return Inertia::render('Admin/Users/Show', ['user' => $user]);
    }

    public function edit(User $user)
    {
        /** @var \App\Models\User $currentUser */
        $currentUser = Auth::user();
        
        // Un admin peut éditer tous les users, un client ne peut éditer que son profil
        if (!$currentUser->isAdmin() && $currentUser->id !== $user->id) {
            abort(403, 'Non autorisé.');
        }
        
        return Inertia::render('Admin/Users/Edit', ['user' => $user]);
    }

    public function update(Request $request, User $user)
    {
        /** @var \App\Models\User $currentUser */
        $currentUser = Auth::user();
        
        // Vérification des permissions
        if (!$currentUser->isAdmin() && $currentUser->id !== $user->id) {
            abort(403, 'Non autorisé.');
        }
        
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'telephone' => 'nullable|string|max:20',
            'adresse' => 'nullable|string',
        ]);

        // Utilisation de la méthode update sur le modèle
        $user->update($request->only(['name', 'email', 'telephone', 'adresse']));

        $redirectRoute = $currentUser->isAdmin() ? 'users.index' : 'dashboard';
        
        return redirect()->route($redirectRoute)
                         ->with('success', 'Profil modifié avec succès.');
    }

    public function destroy(User $user)
    {
        /** @var \App\Models\User $currentUser */
        $currentUser = Auth::user();
        
        if (!$currentUser->isAdmin()) {
            abort(403, 'Accès réservé aux administrateurs.');
        }
        
        $user->delete();

        return redirect()->route('users.index')
                         ->with('success', 'Utilisateur supprimé avec succès.');
    }

    // Méthode pour que les clients puissent éditer leur profil
    public function profile()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        return Inertia::render('Client/Profile/Edit', ['user' => $user]);
    }

    public function updateProfile(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'telephone' => 'nullable|string|max:20',
            'adresse' => 'nullable|string',
        ]);

        $user->update($request->only(['name', 'email', 'telephone', 'adresse']));

        return redirect()->route('dashboard')
                         ->with('success', 'Profil modifié avec succès.');
    }
}