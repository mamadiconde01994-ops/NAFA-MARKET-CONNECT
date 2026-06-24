#!/bin/bash
# Hook pré-installation pour EAS Build
# Copie les fichiers nécessaires du workspace

set -e

echo "🔧 EAS Build Pre-Install Hook"

# Créer les dossiers necessaires pour les dépendances workspace
mkdir -p lib/api-client-react lib/api-spec lib/api-zod lib/db

# Copier les dépendances du workspace (déjà compilées)
# Note: EAS Build télécharge seulement le dossier 'mobile'
# Donc nous avons besoin de compiler ou d'avoir les sources

echo "✓ Pre-install hook complete"
