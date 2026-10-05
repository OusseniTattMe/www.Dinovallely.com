# TattMe — Backend

API pour le site TattMe : réception des demandes, stockage privé des photos, panneau admin, messagerie, conformité RGPD.

## Démarrage rapide

```bash
npm install
cp .env.example .env     # puis remplir les valeurs
npm run migrate          # crée les tables dans Postgres
npm run dev               # démarre le serveur en local
```

Créer le mot de passe admin (hashé, jamais stocké en clair) :
```bash
node -e "console.log(require('bcrypt').hashSync('votre-mot-de-passe', 12))"
```
Coller le résultat dans `ADMIN_PASSWORD_HASH` du fichier `.env`.

## Hébergement recommandé

- **Base de données :** Neon, Supabase ou Railway Postgres — activer le chiffrement au repos (activé par défaut chez ces fournisseurs)
- **Serveur :** Railway, Render ou Fly.io — HTTPS automatique
- **Stockage photos :** par défaut sur disque local (`/uploads`, privé) ; pour la production, remplacer par un bucket S3/Cloudinary en mode privé (le code dans `middleware/upload.js` et `routes/images.js` est fait pour être facilement adapté)
- **Cron de nettoyage :** planifier `npm run cleanup` une fois par jour (cron du fournisseur ou GitHub Actions)

## Où chaque protection est implémentée

| Protection demandée | Implémentation |
|---|---|
| Chiffrement en transit | HTTPS forcé via HSTS (`server.js`) + connexion DB en SSL en production |
| Chiffrement au repos | Délégué à l'hébergeur DB (chiffrement disque natif) — activer l'option chez votre fournisseur |
| Accès restreint aux photos | Aucun fichier n'est servi statiquement ; `routes/images.js` n'autorise l'accès qu'aux requêtes admin authentifiées |
| Minimisation des données | Le schéma (`schema.sql`) ne contient que les champs utilisés par le formulaire |
| Consentement explicite | Vérifié côté serveur (`photo_consent_at`, `submission_consent_at`) avant d'accepter la demande |
| Droit à la suppression | `POST /api/requests/status/delete-request` (client) + `DELETE /api/requests/:id` (admin) |
| Durée de conservation | `src/jobs/retentionCleanup.js`, basé sur `RETENTION_DAYS` |
| Auth admin | Mot de passe hashé (bcrypt) + session JWT (`routes/auth.js`, `middleware/auth.js`) |
| Validation des fichiers | Type MIME + taille limités côté serveur (`middleware/upload.js`) |
| Limitation de débit | `express-rate-limit` sur l'ensemble de l'API, renforcé sur le login et la soumission |
| Pas de carte bancaire stockée | Aucun champ de paiement dans le schéma — à brancher sur Stripe/Square plus tard |

## Endpoints principaux

**Public**
- `POST /api/requests` — soumettre une demande (+ photos)
- `GET /api/requests/status?requestNumber=&email=` — suivre sa demande
- `POST /api/requests/status/delete-request` — demander la suppression de ses données
- `POST /api/messages/:requestId/customer-reply` — répondre à l'artiste

**Admin** (header `Authorization: Bearer <token>`)
- `POST /api/auth/login`
- `GET /api/requests` / `GET /api/requests/:id`
- `PATCH /api/requests/:id` — changer le statut, ajouter des notes
- `DELETE /api/requests/:id` — suppression définitive
- `GET /api/images/:imageId` — voir une photo
- `POST /api/messages/:requestId` — écrire au client

## Prochaine étape

Connecter le frontend (`index.html`) à ces endpoints : remplacer la sauvegarde `localStorage` de l'étape "Submit" par un vrai `fetch('/api/requests', { method: 'POST', body: formData })`, et construire les écrans admin qui consomment `/api/requests`.
