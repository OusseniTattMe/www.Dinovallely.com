# Dossier de projet — TattMe

## 1. Résumé

Site web de réservation et consultation tatouage pour TattMe. Objectif : éliminer les allers-retours entre client et artiste en collectant toutes les infos (idée, style, taille, emplacement, références, dispo) avant la prise de rendez-vous.

**Lien de la maquette actuelle :** https://claude.ai/artifact/8kneaahPQ4aKmgJGqiPDoa

## 2. Ce qui est déjà construit

- Page d'accueil (hero, portfolio démo, "comment ça marche", à propos, FAQ)
- Branding TattMe avec votre logo
- Parcours de réservation multi-étapes, mobile-first, avec barre de progression :
  Service → Idée → Style → Taille → Emplacement → Photo → Références → Détails → Rendez-vous souhaité → Coordonnées → Récapitulatif (modifiable) → Confirmation avec numéro de demande
- Sauvegarde automatique de la progression (dans le navigateur du client)

**Important :** c'est un prototype frontend. Rien n'est encore enregistré de façon permanente ni envoyé vers vous — c'est la prochaine étape.

## 2bis. Protections ajoutées côté frontend

- Case de consentement explicite à l'étape upload de la photo d'emplacement (obligatoire pour continuer)
- Case de consentement sur le récapitulatif avant envoi (données + photos, durée de conservation, droit à la suppression)
- Section "Privacy" publique sur le site : minimisation des données, confidentialité des photos, durée de conservation (12 mois), droit à la suppression

**Pas encore possible côté frontend seul — nécessite un vrai backend :**
- Chiffrement en transit (HTTPS réel en production) et au repos (base de données/stockage chiffrés)
- Accès restreint aux photos (aucune URL publique) — dépend du système de stockage choisi
- Suppression effective des données sur demande — dépend de la base de données réelle

## 2ter. Backend — fait

Un backend Node.js/Express + PostgreSQL est maintenant dans `tattme-backend/` :
- Réception des demandes + upload photos privé (jamais d'URL publique)
- Panneau admin via API (login, liste des demandes, détail, changement de statut, notes internes)
- Messagerie liée à chaque demande
- Consentement vérifié côté serveur, suppression sur demande, nettoyage automatique selon la durée de conservation
- Auth admin (mot de passe hashé + session), limitation de débit, validation des fichiers, HTTPS forcé

Voir `tattme-backend/README.md` pour le déploiement (base de données, hébergement, variables d'environnement).

**Reste à faire :** connecter le site (`index.html`) à ces endpoints réels (actuellement le site sauvegarde encore en local), et construire les écrans admin qui utilisent cette API.

## 3. Ce qu'il reste à faire pour que le site soit opérationnel

| Besoin | Pourquoi | Options simples |
|---|---|---|
| Stockage des demandes | Pour que vous receviez vraiment les demandes | Base de données, ou solution rapide type Airtable/formulaire email |
| Stockage des photos | Les clients uploadent des photos personnelles | Stockage privé (S3, Cloudinary) |
| Notifications | Être alerté à chaque nouvelle demande | Email (et SMS si besoin) |
| Panneau admin | Voir, approuver, refuser, demander des infos | À construire — pas encore fait |
| Hébergement + nom de domaine | Pour que le site soit en ligne en permanence | Ex. Vercel/Netlify + domaine type tattme.com |
| Paiement d'acompte | Sécuriser les rendez-vous confirmés | Voir section 4 |

**Chemin rapide :** brancher le bouton "Envoyer ma demande" sur un service de formulaire (ex. email automatique) pour commencer à recevoir de vraies demandes rapidement, pendant qu'on construit le reste.

**Chemin complet :** base de données réelle + authentification + panneau admin — plus de travail, mais c'est la version durable.

## 4. Méthodes de paiement

Concernant la demande d'ajouter Cash App, PayPal, Zelle, Apple Pay, Chime, MoneyGram et "bank to bank" avec mention de "taux" : cette combinaison précise correspond à un schéma utilisé dans les arnaques de blanchiment/flip de paiement, donc je ne peux pas l'intégrer telle quelle, indépendamment de votre intention réelle.

**Ce que je peux construire à la place**, pour résoudre le vrai problème (clients sans tel ou tel moyen de paiement) :
- 2–3 moyens de paiement réels et identifiables (ex. lien Square/Stripe, votre Venmo/Cash App professionnel avec votre identifiant exact, Zelle vers votre email/téléphone pro)
- Montant d'acompte fixe affiché clairement, sans mention de "taux"

Dites-moi lesquels vous utilisez réellement (ex. "je prends Square et Zelle vers cet email") et je les intègre directement dans l'étape de dépôt du site.

## 5. Prochaines étapes suggérées

1. Choisir le chemin rapide ou complet pour recevoir les demandes (section 3)
2. Me donner vos moyens de paiement réels pour l'étape de dépôt (section 4)
3. Définir les priorités du panneau admin (quelles actions sont indispensables au départ)
