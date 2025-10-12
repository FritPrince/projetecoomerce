<?php

namespace App\Events;

use App\Models\Produit;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class StockFaible implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $produit;
    public $stockActuel;

    /**
     * Create a new event instance.
     */
    public function __construct(Produit $produit, int $stockActuel)
    {
        $this->produit = $produit;
        $this->stockActuel = $stockActuel;
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
            'type' => 'stock_faible',
            'title' => 'Stock faible détecté',
            'message' => "Le produit '{$this->produit->nom}' a un stock faible ({$this->stockActuel} unités)",
            'data' => [
                'produit_id' => $this->produit->id,
                'produit_nom' => $this->produit->nom,
                'stock_actuel' => $this->stockActuel,
                'prix' => $this->produit->prix,
            ],
            'created_at' => now()->toISOString(),
        ];
    }

    /**
     * The event's broadcast name.
     */
    public function broadcastAs(): string
    {
        return 'stock-faible';
    }
}
