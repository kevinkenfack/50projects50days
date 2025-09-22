# Cahier des Charges - TerrainCameroun

## 1. Présentation du Projet

### 1.1 Contexte
Développement d'une plateforme web moderne de présentation et vente de terrains au Cameroun, destinée à faciliter les transactions immobilières entre vendeurs et acheteurs.

### 1.2 Objectifs
- Créer une application web robuste avec séparation claire des espaces Client et Admin
- Implémenter un système d'authentification fiable sans confirmation email
- Développer un back-office efficace pour la gestion des contenus
- Permettre aux utilisateurs de vendre leurs propres terrains

### 1.3 Cible
- **Clients** : Particuliers souhaitant acheter des terrains au Cameroun
- **Vendeurs** : Propriétaires terriens souhaitant vendre leurs biens
- **Administrateurs** : Gestionnaires de la plateforme

## 2. Spécifications Techniques

### 2.1 Stack Technologique
- **Frontend** : React 18 + TypeScript + Vite + React Router (v7+)
- **UI/UX** : Tailwind CSS + Lucide React (icônes)
- **État** : React Context + hooks locaux
- **Backend** : Supabase (Auth + PostgREST + SQL + Storage)
- **Gestionnaire de paquets** : pnpm (obligatoire)
- **Qualité** : ESLint + TypeScript strict
- **PWA** : Désactivée pour le MVP

### 2.2 Architecture du Projet
```
src/
├── app/
│   └── routes/
│       ├── client/          # Pages espace client
│       ├── admin/           # Pages back-office
│       ├── auth/            # Pages d'authentification
│       └── public/          # Pages publiques
├── components/
│   ├── common/              # Composants réutilisables
│   ├── client/              # Composants spécifiques client
│   └── admin/               # Composants spécifiques admin
├── contexts/                # Contextes React
├── lib/                     # Configuration et utilitaires
├── types/                   # Types TypeScript
└── styles/                  # Styles CSS
```

## 3. Spécifications Fonctionnelles

### 3.1 Espace Public (Landing Page)

#### 3.1.1 Page d'Accueil
- **Héro Section** : Image attractive avec branding de l'entreprise
- **Services & Valeurs** : Présentation des services offerts
- **Témoignages** : Retours clients
- **Contact** : Informations de contact
- **CTA** : Boutons "Se connecter" et "Créer un compte"

#### 3.1.2 Aperçu Catalogue
- Affichage d'un aperçu du catalogue pour les visiteurs non connectés
- Modal de création de compte/connexion lors du clic sur un terrain

### 3.2 Système d'Authentification

#### 3.2.1 Routes d'Authentification
- `/login` : Connexion client
- `/register` : Inscription client
- `/admin/login` : Connexion administrateur

#### 3.2.2 Fonctionnalités
- **Inscription client** : Session active immédiate (pas de confirmation email)
- **Redirection automatique** : Vers `/client` après inscription/connexion
- **Gestion d'erreurs** : Messages clairs pour erreurs de validation
- **Séparation des rôles** : Admin et clients utilisent des routes distinctes

### 3.3 Espace Client

#### 3.3.1 Navigation
- **Header** : Catalogue, Villes, Contact, Déconnexion
- **Menu des villes** : Navigation par ville et quartier

#### 3.3.2 Catalogue des Terrains
- **Vue liste** : Terrains paginés et filtrables
- **Informations affichées par terrain** :
  - Quartier et dimensions
  - Prix du terrain
  - Frais d'acquisition estimés
  - Prix total (terrain + frais)
  - Indicateur "documents prêts"

#### 3.3.3 Pages par Ville
- Route : `/client/city/:cityId`
- Liste des terrains disponibles dans la ville sélectionnée

#### 3.3.4 Détail Terrain
- Route : `/client/property/:propertyId`
- **Média** : Galerie d'images (3+) et vidéo
- **Informations** : Description détaillée, prix, frais, documents
- **CTA** : Boutons "Nous contacter" (mailto) et téléphone

### 3.4 Espace Vendeur

#### 3.4.1 Activation du Statut Vendeur
- Bouton "Devenir vendeur" depuis l'espace client
- Activation du flag `is_seller` sur le profil utilisateur

#### 3.4.2 Gestion des Terrains
- **Mes terrains** : `/client/seller`
- **Nouveau terrain** : `/client/seller/new`
- **Édition** : `/client/seller/:id/edit`
- **Gestion images** : `/client/seller/:id/images`

#### 3.4.3 Statuts des Terrains
- **pending** : En attente de validation admin
- **available** : Approuvé et visible
- **rejected** : Refusé par l'admin

#### 3.4.4 Statistiques Vendeur
- Nombre de terrains (total/pending/available)
- Vues cumulées (placeholder)
- Demandes reçues

### 3.5 Espace Administrateur

#### 3.5.1 Dashboard
- **Statistiques KPI** :
  - Nombre total d'utilisateurs
  - Vendeurs actifs
  - Nombre de villes
  - Terrains (total/available/pending)
  - Demandes de contact
- **Graphiques** : Nouveaux terrains par semaine/mois

#### 3.5.2 Gestion des Villes
- CRUD complet (Créer, Lire, Mettre à jour, Supprimer)
- Champs : nom, région

#### 3.5.3 Gestion des Terrains
- CRUD complet des propriétés
- **Champs** :
  - Titre, ville, quartier
  - Dimensions, prix, frais d'acquisition
  - Description, vidéo
  - Statut (available/sold/reserved/pending)
  - Documents prêts (boolean)

#### 3.5.4 Gestion des Images
- Liste/ajout/suppression d'images par terrain
- Sélection de l'image principale

#### 3.5.5 Workflow d'Approbation
- Validation des terrains proposés par les vendeurs
- Passage de `pending` à `available` ou `rejected`

#### 3.5.6 Gestion des Demandes
- Liste des demandes de contact
- Statuts : pending/contacted/closed

## 4. Base de Données (Supabase)

### 4.1 Structure des Tables

#### 4.1.1 Table `users`
```sql
- id uuid PK (référence auth.users)
- email text NOT NULL
- first_name text NOT NULL
- last_name text NOT NULL
- phone text NOT NULL
- country text NOT NULL DEFAULT 'Cameroun'
- is_admin boolean DEFAULT false
- is_seller boolean DEFAULT false
- created_at timestamptz DEFAULT now()
```

#### 4.1.2 Table `cities`
```sql
- id uuid PK DEFAULT gen_random_uuid()
- name text NOT NULL
- region text NOT NULL
- created_at timestamptz DEFAULT now()
```

#### 4.1.3 Table `properties`
```sql
- id uuid PK DEFAULT gen_random_uuid()
- title text NOT NULL
- city_id uuid FK → cities(id)
- neighborhood text NOT NULL
- dimensions text NOT NULL
- price numeric NOT NULL
- acquisition_fees numeric NOT NULL
- total_price numeric GENERATED (price + acquisition_fees)
- documents_ready boolean DEFAULT false
- description text
- video_url text
- owner_id uuid FK → users(id) NOT NULL
- status text DEFAULT 'available'
- created_at timestamptz DEFAULT now()
```

#### 4.1.4 Table `property_images`
```sql
- id uuid PK DEFAULT gen_random_uuid()
- property_id uuid FK → properties(id)
- image_url text NOT NULL
- is_primary boolean DEFAULT false
- created_at timestamptz DEFAULT now()
```

#### 4.1.5 Table `inquiries`
```sql
- id uuid PK DEFAULT gen_random_uuid()
- property_id uuid FK → properties(id)
- user_id uuid FK → users(id)
- message text NOT NULL
- phone text
- status text DEFAULT 'pending'
- created_at timestamptz DEFAULT now()
```

### 4.2 Sécurité (RLS - Row Level Security)

#### 4.2.1 Politiques Client (authenticated)
- **Cities** : SELECT autorisé pour tous
- **Properties** : SELECT si status = 'available' OU owner_id = user courant
- **Property_images** : SELECT autorisé pour tous
- **Users** : SELECT/UPDATE/INSERT uniquement sur sa propre ligne
- **Inquiries** : INSERT/SELECT uniquement pour ses propres demandes

#### 4.2.2 Politiques Admin
- Accès complet (ALL) sur cities, properties, property_images, inquiries
- SELECT sur users
- Basé sur le claim JWT `is_admin = true`

#### 4.2.3 Politiques Vendeur
- INSERT/UPDATE/DELETE sur properties et property_images si owner_id = user courant

### 4.3 Fonctions et Triggers
- **Trigger `handle_new_user`** : Création automatique du profil lors de l'inscription
- **Fonction `mark_user_as_admin(email)`** : Promotion d'un utilisateur en admin
- **Fonction `mark_user_as_seller(email, is_seller boolean)`** : Activation/désactivation du statut vendeur

## 5. Interface Utilisateur

### 5.1 Design System
- **Couleur primaire** : Configurable (ex: emerald)
- **Responsive** : Mobile-first, optimisé pour ≤375px et tablettes
- **Accessibilité** : Contraste AA minimum
- **États interactifs** : hover/active/disabled définis

### 5.2 Composants UI

#### 5.2.1 Composants Communs
- Button, Input, Select, Textarea
- Modal, Card, Badge, Loader
- Pagination, Table

#### 5.2.2 Composants Client
- PropertyCard, PropertyGallery
- PriceBreakdown, CityMenu
- Header, Footer

#### 5.2.3 Composants Vendeur
- SellerPropertiesList, SellerPropertyForm
- SellerImagesManager, SellerStatusBadge

#### 5.2.4 Composants Admin
- DataTable, FormCity, FormProperty
- FormImagesUploader, FilterBar, Tabs

### 5.3 Codes Couleur des Statuts
- **available** : Vert (bg-green-100 text-green-800)
- **sold** : Rouge (bg-red-100 text-red-800)
- **reserved** : Jaune (bg-yellow-100 text-yellow-800)
- **pending** : Violet (bg-purple-100 text-purple-800)
- **rejected** : Gris (bg-gray-100 text-gray-800)

### 5.4 UX/UI
- **Notifications** : react-hot-toast (position top-right)
- **Loaders** : Affichage pendant les requêtes
- **États vides** : Messages et illustrations pour contenus vides
- **Validation** : Formulaires avec validation en temps réel

## 6. Plan de Routage

### 6.1 Routes Publiques
- `/` : Landing page

### 6.2 Routes Client
- `/login` : Connexion
- `/register` : Inscription
- `/client` : Catalogue principal
- `/client/city/:cityId` : Terrains par ville
- `/client/property/:propertyId` : Détail d'un terrain
- `/client/contact` : Page contact

### 6.3 Routes Vendeur (intégrées côté client)
- `/client/seller` : Mes terrains
- `/client/seller/new` : Nouveau terrain
- `/client/seller/:id/edit` : Édition terrain
- `/client/seller/:id/images` : Gestion images

### 6.4 Routes Admin
- `/admin/login` : Connexion admin
- `/admin` : Dashboard
- `/admin/cities` : Gestion des villes
- `/admin/properties` : Gestion des terrains
- `/admin/properties/:id/images` : Gestion images terrain
- `/admin/inquiries` : Gestion des demandes

### 6.5 Règles de Redirection
- Non connecté + route protégée → redirection vers login approprié
- Après login client → `/client`
- Après login admin → `/admin`
- Admin peut accéder à `/client` (prévisualisation)

## 7. Configuration et Déploiement

### 7.1 Variables d'Environnement
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 7.2 Scripts NPM
- `pnpm dev` : Serveur de développement
- `pnpm build` : Build de production
- `pnpm preview` : Prévisualisation du build
- `pnpm lint` : Vérification du code

### 7.3 Migrations Supabase
- Fichiers de migration dans `supabase/migrations/`
- Script SQL de reset complet
- Documentation d'exécution des migrations

## 8. Données de Test (Seed)

### 8.1 Villes
- Insertion de villes principales : Douala, Yaoundé, Bafoussam, etc.

### 8.2 Terrains
- 5 terrains de démonstration répartis dans les villes
- 3 images par terrain (URLs Pexels)
- Une image marquée comme principale

### 8.3 Utilisateurs de Test
- Utilisateur vendeur : `seller@terraincameroun.com`
- 1-2 terrains en statut `pending` associés

## 9. Critères d'Acceptation

### 9.1 Parcours Client
✅ Register → redirection `/client` → catalogue → filtre par ville → détail → contact

### 9.2 Parcours Admin
✅ `/admin/login` → `/admin` → statistiques → CRUD villes/terrains → persistance

### 9.3 Sécurité RLS
✅ Pas de récursivité ni erreurs 500
✅ Clients accèdent uniquement à leurs données autorisées
✅ Admins ont accès complet selon les politiques

### 9.4 Qualité Code
✅ Organisation par domaines (client/admin/common)
✅ Composants réutilisables
✅ Types TypeScript explicites
✅ Code propre et documenté

## 10. Fonctionnalités Bonus (Optionnelles)

### 10.1 Améliorations UX
- Pagination avancée côté client et admin
- Recherche/filtre par quartier et statut
- Sauvegarde automatique des formulaires

### 10.2 Gestion des Médias
- Upload d'images via Supabase Storage
- Compression automatique des images
- Gestion des formats vidéo

### 10.3 Analytics
- Statistiques de vues par terrain
- Tableau de bord vendeur avancé
- Rapports d'activité admin

## 11. Contraintes et Exigences

### 11.1 Performance
- Temps de chargement < 3 secondes
- Images optimisées pour le web
- Lazy loading des composants

### 11.2 Sécurité
- Validation côté client et serveur
- Gestion sécurisée des erreurs
- Pas de données sensibles en plain text

### 11.3 Maintenance
- Code documenté et commenté
- Tests unitaires recommandés
- Logs d'erreurs structurés

## 12. Livrables

### 12.1 Code Source
- Repository Git complet
- Configuration environnement
- Documentation README détaillée

### 12.2 Base de Données
- Scripts de migration Supabase
- Données de seed
- Documentation des tables et relations

### 12.3 Documentation
- Guide d'installation
- Guide d'utilisation
- Documentation technique

---

**Date de livraison estimée** : 1 semaine
**Maintenance** : réguliere
