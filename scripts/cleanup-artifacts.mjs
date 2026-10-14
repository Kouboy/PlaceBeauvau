#!/usr/bin/env node

/**
 * Script de nettoyage des artefacts GitHub Actions pour PlaceBeauvau
 * Utilisation :
 *   node scripts/cleanup-artifacts.mjs --repo=PROPRIETAIRE/DEPOT [--token=ghp_...] [--days=1] [--dry-run]
 * 
 * Ou avec GitHub CLI :
 *   gh api repos/OWNER/REPO/actions/artifacts --paginate | jq ...
 */

import https from 'node:https';

const args = process.argv.slice(2);
const getArg = (name, def = null) => {
  const prefix = `--${name}=`;
  const found = args.find((a) => a.startsWith(prefix));
  if (found) return found.slice(prefix.length);
  if (args.includes(`--${name}`)) return true;
  return def;
};

const repo = getArg('repo', process.env.GITHUB_REPOSITORY);
const token = getArg('token', process.env.GITHUB_TOKEN);
const days = parseInt(getArg('days', '1'), 10);
const dryRun = Boolean(getArg('dry-run', false));

if (!repo) {
  console.error("Erreur : Spécifiez le dépôt avec --repo=PROPRIETAIRE/NOM_DEPOT (ou GITHUB_REPOSITORY)");
  process.exit(1);
}

if (!token) {
  console.log("Note : Aucun jeton fourni. Vous pouvez également utiliser le workflow GitHub Actions dédié :");
  console.log("       .github/workflows/cleanup-artifacts.yml (exécutable d'un clic via l'onglet Actions).");
}

console.log(`=== Audit et Nettoyage des Artefacts Actions ===`);
console.log(`Dépôt : ${repo}`);
console.log(`Rétention : ${days} jour(s)`);
console.log(`Mode simulation : ${dryRun ? 'OUI' : 'NON'}`);
console.log(`=================================================`);

// Helper API request
function ghRequest(path, method = 'GET') {
  return new Promise((resolve, reject) => {
    const req = https.request(
      `https://api.github.com${path}`,
      {
        method,
        headers: {
          'User-Agent': 'PlaceBeauvau-Artifact-Cleaner',
          'Accept': 'application/vnd.github+json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(data ? JSON.parse(data) : null);
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${data}`));
          }
        });
      }
    );
    req.on('error', reject);
    req.end();
  });
}

async function run() {
  if (!token) {
    console.log(`\nPour exécuter le nettoyage depuis votre poste local :`);
    console.log(`  GITHUB_TOKEN=votre_pat node scripts/cleanup-artifacts.mjs --repo=${repo} --days=${days}`);
    console.log(`\nOu via GitHub CLI :`);
    console.log(`  gh api repos/${repo}/actions/artifacts --paginate --jq '.artifacts[] | select(.expired == false) | .id' | xargs -I {} gh api -X DELETE repos/${repo}/actions/artifacts/{}`);
    return;
  }

  try {
    const data = await ghRequest(`/repos/${repo}/actions/artifacts?per_page=100`);
    const artifacts = data.artifacts || [];
    console.log(`Nombre total d'artefacts trouvés : ${artifacts.length}`);

    const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    let toDelete = 0;
    let freedBytes = 0;

    for (const art of artifacts) {
      const created = new Date(art.created_at);
      if (created < cutoff) {
        toDelete++;
        freedBytes += art.size_in_bytes;
        console.log(`[CIBLE] ID: ${art.id} | Nom: ${art.name} | ${(art.size_in_bytes / 1024 / 1024).toFixed(2)} Mo | ${art.created_at}`);
        if (!dryRun) {
          await ghRequest(`/repos/${repo}/actions/artifacts/${art.id}`, 'DELETE');
          console.log(`  -> Supprimé.`);
        }
      }
    }

    console.log(`\nBilan : ${toDelete} artefacts purgés, ${(freedBytes / 1024 / 1024).toFixed(2)} Mo libérés.`);
  } catch (err) {
    console.error(`Erreur : ${err.message}`);
  }
}

run();
