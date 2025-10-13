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
use App\Http\Controllers\SearchController;
use App\Http\Controllers\RecommendationController;
use App\Http\Controllers\CompareController;
use App\Http\Controllers\CouponController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\Settings\PasswordController;

// ==================== ROUTES PUBLIQUES ====================
// (Accessibles sans authentification)

// Page d'accueil principale
Route::get('/', [AccueilController::class, 'index'])->name('home');

// Recherche
Route::get('/search', [SearchController::class, 'index'])->name('search');
Route::get('/api/search/suggestions', [SearchController::class, 'suggestions'])->name('search.suggestions');

// API pour les recommandations
Route::get('/api/recommendations', [RecommendationController::class, 'getRecommendations'])->name('recommendations');
Route::get('/api/products/{produit}/similar', [RecommendationController::class, 'getSimilarProducts'])->name('products.similar');

// API pour les coupons
Route::post('/api/coupons/validate', [CouponController::class, 'validateCoupon'])->name('coupons.validate');
Route::get('/api/coupons/active', [CouponController::class, 'getActiveCoupons'])->name('coupons.active');

// Comparaison de produits
Route::get('/compare', [CompareController::class, 'index'])->name('compare.index');
Route::post('/api/compare/add', [CompareController::class, 'add'])->name('compare.add');
Route::post('/api/compare/remove', [CompareController::class, 'remove'])->name('compare.remove');
Route::post('/api/compare/clear', [CompareController::class, 'clear'])->name('compare.clear');
Route::get('/api/compare/list', [CompareController::class, 'getCompareList'])->name('compare.list');
Route::get('/categorie/{categorie}', [AccueilController::class, 'filtrerParCategorie'])->name('categorie.filter');
Route::get('/produit/{produit}', [AccueilController::class, 'showProduit'])->name('produits.show'); // CHANGEMENT: /produit au lieu de /produits

Route::put('/password', [PasswordController::class, 'update'])->name('password.update');
Route::get('/password/edit', [PasswordController::class, 'edit'])->name('password.edit');
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
    Route::get('/profile', [UserController::class, 'profile'])->name('profile.edit-user');
    Route::patch('/profile', [UserController::class, 'updateProfile'])->name('profile.update-user');
    
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
        // Profil client
        Route::get('/client/profile', [App\Http\Controllers\Client\ProfileController::class, 'show'])->name('profile.show');
        Route::get('/client/profile/edit', [App\Http\Controllers\Client\ProfileController::class, 'edit'])->name('profile.edit');
        Route::match(['put', 'patch'], '/client/profile', [App\Http\Controllers\Client\ProfileController::class, 'update'])->name('profile.update');
        Route::get('/client/profile/password', [App\Http\Controllers\Client\ProfileController::class, 'edit'])->name('profile.password');
        Route::put('/client/profile/password', [App\Http\Controllers\Client\ProfileController::class, 'updatePassword'])->name('profile.password.update');
        
        // Commandes client
        Route::get('/mes-commandes', [App\Http\Controllers\Client\CommandeController::class, 'index'])->name('client.commandes.index');
        Route::get('/mes-commandes/{id}', [App\Http\Controllers\Client\CommandeController::class, 'show'])->name('client.commandes.show');
        Route::post('/mes-commandes/{id}/cancel', [App\Http\Controllers\Client\CommandeController::class, 'cancel'])->name('client.commandes.cancel');
        
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
        Route::post('/api/favoris/toggle', [FavoriController::class, 'toggle'])->name('favoris.toggle');
        Route::get('/api/favoris/check', [FavoriController::class, 'isFavori'])->name('favoris.check');
        Route::get('/api/favoris/count', [FavoriController::class, 'getFavorisCount'])->name('favoris.count');
        
        // Comparaison
        Route::get('/comparer', [App\Http\Controllers\CompareController::class, 'index'])->name('compare.index');
        Route::post('/api/compare/add', [App\Http\Controllers\CompareController::class, 'add'])->name('compare.add');
        Route::post('/api/compare/remove', [App\Http\Controllers\CompareController::class, 'remove'])->name('compare.remove');
        Route::post('/api/compare/clear', [App\Http\Controllers\CompareController::class, 'clear'])->name('compare.clear');
        Route::get('/api/compare/count', [App\Http\Controllers\CompareController::class, 'getCount'])->name('compare.count');
        
        // Profil client
        Route::get('/client/profil', [AccueilController::class, 'profil'])->name('profil.index');
        
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
        Route::resource('coupons', App\Http\Controllers\CouponController::class);
        
        // Remboursements
        Route::post('/paiements/{paiement}/refund', [PaymentController::class, 'refundPayment'])->name('paiements.refund');
        
        // Routes admin supplémentaires
        Route::get('/admin/statistiques', [App\Http\Controllers\Admin\StatistiquesController::class, 'index'])->name('admin.statistiques');
        Route::get('/admin/rapports', [App\Http\Controllers\Admin\RapportsController::class, 'index'])->name('admin.rapports');
        Route::post('/admin/rapports/generate', [App\Http\Controllers\Admin\RapportsController::class, 'generate'])->name('admin.rapports.generate');
        Route::get('/admin/parametres', [App\Http\Controllers\Admin\ParametresController::class, 'index'])->name('admin.parametres');
        Route::put('/admin/parametres', [App\Http\Controllers\Admin\ParametresController::class, 'update'])->name('admin.parametres.update');
        Route::post('/admin/parametres/upload-logo', [App\Http\Controllers\Admin\ParametresController::class, 'uploadLogo'])->name('admin.parametres.upload-logo');
        Route::post('/admin/parametres/test-email', [App\Http\Controllers\Admin\ParametresController::class, 'testEmail'])->name('admin.parametres.test-email');
        
        // Route de test admin
        Route::get('/test-admin-route', function () {
            return 'Cette route est accessible uniquement aux admins !';
        });
    });
});

require __DIR__.'/auth.php';