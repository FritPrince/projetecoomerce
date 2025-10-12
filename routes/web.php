<?php
// routes/web.php
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

// Contrôleurs Admin
use App\Http\Controllers\UserController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\CategorieController;
use App\Http\Controllers\SousCategorieController;
use App\Http\Controllers\ProduitController;
use App\Http\Controllers\CommandeController;
use App\Http\Controllers\PaiementController;
use App\Http\Controllers\MethodePaiementController;

// Contrôleurs Client
use App\Http\Controllers\AccueilController;
use App\Http\Controllers\PanierController;
use App\Http\Controllers\FavoriController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\Settings\PasswordController;

// ==================== ROUTES PUBLIQUES ====================
// (Accessibles sans authentification)

// Page d'accueil principale
Route::get('/', function () {
    return Inertia::render('bienvenue');
})->name('home');

// Routes publiques pour les clients (affichage des produits)
Route::get('/rechercher', [AccueilController::class, 'rechercher'])->name('rechercher');
Route::get('/categorie/{categorie}', [AccueilController::class, 'filtrerParCategorie'])->name('categorie.filter');
Route::get('/produit/{produit}', [AccueilController::class, 'showProduit'])->name('produits.show'); // CHANGEMENT: /produit au lieu de /produits

Route::put('/password', [PasswordController::class, 'update'])->name('password.update');
// Routes de test
Route::get('/test-role', function () {
    /** @var \App\Models\User $user */
    $user = Auth::user();
    dump($user);
    dump($user->role);
    dump($user->isAdmin());
    
    return 'Check your console';
});

// ==================== ROUTES AUTHENTIFIÉES ====================
// (Accessibles uniquement aux utilisateurs connectés)

Route::middleware(['auth'])->group(function () {
    
    // Dashboard et profil (accessibles à tous les utilisateurs connectés)
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/profile', [UserController::class, 'profile'])->name('profile.edit');
    
    // Édition de profil
    Route::get('/users/{user}/edit', [UserController::class, 'edit'])->name('users.edit');
    Route::put('/users/{user}', [UserController::class, 'update'])->name('users.update');

    // Notifications (accessibles à tous les utilisateurs connectés)
    Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications.index');
    Route::post('/notifications/{notification}/mark-as-read', [NotificationController::class, 'markAsRead'])->name('notifications.mark-as-read');
    Route::post('/notifications/mark-all-as-read', [NotificationController::class, 'markAllAsRead'])->name('notifications.mark-all-as-read');
    Route::delete('/notifications/{notification}', [NotificationController::class, 'destroy'])->name('notifications.destroy');
    Route::get('/api/notifications/unread-count', [NotificationController::class, 'unreadCount'])->name('api.notifications.unread-count');
    Route::get('/api/notifications/recent', [NotificationController::class, 'recent'])->name('api.notifications.recent');

    // ==================== ROUTES CLIENT ====================
    Route::middleware(['role:client'])->group(function () {
        // Panier
        Route::get('/panier', [PanierController::class, 'index'])->name('panier.index');
        Route::post('/panier/ajouter', [PanierController::class, 'ajouter'])->name('panier.ajouter');
        Route::put('/panier/{commande}/mettre-a-jour', [PanierController::class, 'mettreAJour'])->name('panier.mettre-a-jour');
        Route::delete('/panier/{commande}/produit/{produit}', [PanierController::class, 'supprimer'])->name('panier.supprimer');
        Route::post('/panier/{commande}/paiement', [PanierController::class, 'procederAuPaiement'])->name('panier.paiement');
        
        // Favoris
        Route::get('/favoris', [FavoriController::class, 'index'])->name('favoris.index');
        Route::post('/favoris/ajouter', [FavoriController::class, 'ajouter'])->name('favoris.ajouter');
        Route::delete('/favoris/{favori}', [FavoriController::class, 'supprimer'])->name('favoris.supprimer');
        
        // Profil client
        Route::get('/profil', [AccueilController::class, 'profil'])->name('profil.index');
        
        // Commandes client (historique)
        Route::get('/commandes', [AccueilController::class, 'commandes'])->name('commandes.index');
        
        // Paiements
        Route::get('/payment/methods/{commande}', [PaymentController::class, 'showPaymentMethods'])->name('payment.methods');
        Route::get('/payment/stripe/{commande}', [PaymentController::class, 'showStripePayment'])->name('payment.stripe');
        Route::post('/payment/stripe/create-intent/{commande}', [PaymentController::class, 'createStripePaymentIntent'])->name('payment.stripe.create-intent');
        Route::post('/payment/stripe/process/{commande}', [PaymentController::class, 'processStripePayment'])->name('payment.stripe.process');
        Route::post('/payment/paypal/create-order/{commande}', [PaymentController::class, 'createPayPalOrder'])->name('payment.paypal.create-order');
        Route::post('/payment/paypal/capture/{commande}', [PaymentController::class, 'capturePayPalOrder'])->name('payment.paypal.capture');
        Route::get('/payment/paypal/success', [PaymentController::class, 'paypalSuccess'])->name('paypal.success');
        Route::get('/payment/paypal/cancel', [PaymentController::class, 'paypalCancel'])->name('paypal.cancel');
    });

    // ==================== ROUTES ADMIN ====================
    Route::middleware(['role:admin'])->group(function () {
        Route::resource('users', UserController::class);
        Route::resource('categories', CategorieController::class);
        Route::resource('sous-categories', SousCategorieController::class);
        
        // Routes admin pour les produits - préfixe différent
        Route::resource('produits', ProduitController::class); // Crée: /produits, /produits/create, /produits/{produit}, etc.
        
        Route::resource('commandes', CommandeController::class);
        Route::resource('paiements', PaiementController::class);
        Route::resource('methodes-paiement', MethodePaiementController::class);
        
        // Remboursements
        Route::post('/paiements/{paiement}/refund', [PaymentController::class, 'refundPayment'])->name('paiements.refund');
        
        // Route de test admin
        Route::get('/test-admin-route', function () {
            return 'Cette route est accessible uniquement aux admins !';
        });
    });
});

require __DIR__.'/auth.php';