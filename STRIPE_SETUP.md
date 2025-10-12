# Configuration Stripe

## Variables d'environnement requises

Ajoutez ces variables à votre fichier `.env` :

```env
# Configuration Stripe
STRIPE_KEY=pk_test_your_stripe_public_key_here
STRIPE_SECRET=sk_test_your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

## Instructions

1. Créez un compte Stripe sur https://stripe.com
2. Récupérez vos clés API depuis le dashboard Stripe
3. Remplacez les valeurs dans votre fichier `.env`
4. Redémarrez votre serveur Laravel

## Test des cartes

Utilisez ces cartes de test pour tester les paiements :

- **Succès** : 4242 4242 4242 4242
- **Échec** : 4000 0000 0000 0002
- **Authentification 3D Secure** : 4000 0025 0000 3155

Date d'expiration : n'importe quelle date future
CVC : n'importe quel code à 3 chiffres

