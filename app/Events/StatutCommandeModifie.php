<?php

namespace App\Events;

use App\Models\Commande;
use App\Models\User;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class StatutCommandeModifie implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $commande;
    public $user;
    public $ancienStatut;
    public $nouveauStatut;

    /**
     * Create a new event instance.
     */
    public function __construct(Commande $commande, User $user, string $ancienStatut, string $nouveauStatut)
    {
        $this->commande = $commande;
        $this->user = $user;
        $this->ancienStatut = $ancienStatut;
        $this->nouveauStatut = $nouveauStatut;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('user-notifications.' . $this->user->id),
        ];
    }

    /**
     * Get the data to broadcast.
     */
    public function broadcastWith(): array
    {
        $statuts = [
            'en_attente' => 'En attente',
            'confirmee' => 'Confirmée',
            'expediee' => 'Expédiée',
            'livree' => 'Livrée',
            'annulee' => 'Annulée',
            'panier' => 'Panier'
        ];

        return [
            'type' => 'statut_commande_modifie',
            'title' => 'Statut de commande mis à jour',
            'message' => "Votre commande #{$this->commande->numero_commande} est maintenant {$statuts[$this->nouveauStatut]}",
            'data' => [
                'commande_id' => $this->commande->id,
                'numero_commande' => $this->commande->numero_commande,
                'ancien_statut' => $this->ancienStatut,
                'nouveau_statut' => $this->nouveauStatut,
                'ancien_statut_label' => $statuts[$this->ancienStatut] ?? $this->ancienStatut,
                'nouveau_statut_label' => $statuts[$this->nouveauStatut] ?? $this->nouveauStatut,
            ],
            'created_at' => now()->toISOString(),
        ];
    }

    /**
     * The event's broadcast name.
     */
    public function broadcastAs(): string
    {
        return 'statut-commande-modifie';
    }
}
