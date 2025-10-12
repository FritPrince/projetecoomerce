<?php
// database/seeders/PaiementSeeder.php
namespace Database\Seeders;

use App\Models\Paiement;
use App\Models\Commande;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class PaiementSeeder extends Seeder
{
    public function run(): void
    {
        $commandes = Commande::where('statut', '!=', 'panier')->get();

        if ($commandes->isEmpty()) {
            return;
        }

        foreach ($commandes as $commande) {
            $dateCommande = Carbon::parse($commande->date_commande);
            $datePaiement = $dateCommande->addDays(rand(0, 2));


            $statutPaiement = $this->getStatutPaiementFromCommande($commande->statut);

            Paiement::create([
                'reference' => 'PAY-' . $commande->id . '-' . time() . rand(1000, 9999),
                'montant' => $commande->total,
                'date_paiement' => $datePaiement,
                'statut' => $statutPaiement,
                'user_id' => $commande->user_id
            ]);
        }
    }

    /**
     * Détermine le statut du paiement en fonction du statut de la commande
     */
    private function getStatutPaiementFromCommande(string $statutCommande): string
    {
        return match($statutCommande) {
            'livree' => 'paye',        // Commande livrée = paiement payé
            'expediee' => 'paye',      // Commande expédiée = paiement payé
            'confirmee' => 'paye',     // Commande confirmée = paiement payé
            'en_attente' => 'en_attente', // Commande en attente = paiement en attente
            'annulee' => 'rembourse',  // Commande annulée = paiement remboursé
            default => 'en_attente'
        };
    }
}