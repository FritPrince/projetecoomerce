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

class NouvelleCommande implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $commande;
    public $user;

    /**
     * Create a new event instance.
     */
    public function __construct(Commande $commande, User $user)
    {
        $this->commande = $commande;
        $this->user = $user;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('admin-notifications'),
        ];
    }

    /**
     * Get the data to broadcast.
     */
    public function broadcastWith(): array
    {
        return [
            'type' => 'nouvelle_commande',
            'title' => 'Nouvelle commande reçue',
            'message' => "Commande #{$this->commande->numero_commande} de {$this->user->name}",
            'data' => [
                'commande_id' => $this->commande->id,
                'numero_commande' => $this->commande->numero_commande,
                'total' => $this->commande->total,
                'user_name' => $this->user->name,
                'user_email' => $this->user->email,
            ],
            'created_at' => now()->toISOString(),
        ];
    }

    /**
     * The event's broadcast name.
     */
    public function broadcastAs(): string
    {
        return 'nouvelle-commande';
    }
}
