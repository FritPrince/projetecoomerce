<?php

namespace App\Policies;

use App\Models\Favori;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class FavoriPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return true; // Les utilisateurs peuvent voir leurs propres favoris
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Favori $favori): bool
    {
        return $user->id === $favori->user_id; // Seulement ses propres favoris
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return true; // Les utilisateurs peuvent créer des favoris
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Favori $favori): bool
    {
        return $user->id === $favori->user_id; // Seulement ses propres favoris
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Favori $favori): bool
    {
        return $user->id === $favori->user_id; // Seulement ses propres favoris
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Favori $favori): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Favori $favori): bool
    {
        return false;
    }
}
