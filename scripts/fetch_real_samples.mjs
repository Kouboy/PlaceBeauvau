/**
 * Script de récupération des enregistrements authentiques libres (Kit A1 - PlaceBeauvau)
 * 
 * Ce script télécharge les enregistrements libres de droits (CC0 / CC-BY)
 * pour remplacer les maquettes DEMO par des prises de son réelles.
 * Les attributions et licences détaillées sont documentées dans CREDITS.md.
 */

import fs from "fs";
import path from "path";
import https from "https";
import http from "http";

const targetDir = path.resolve("public/audio/real");
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

console.log("=== RÉCUPÉRATION DES SAMPLES AUDIO LIBRES (KIT A1) ===");
console.log("Dossier de destination :", targetDir);

// Liste des sources authentiques libres (Wikimedia Commons, Freesound CC0 / CC-BY mirrors)
const SAMPLES = [
  {
    filename: "00_roomtone_feutre_REAL.ogg",
    url: "https://upload.wikimedia.org/wikipedia/commons/2/22/Air_conditioner_sound.ogg",
    desc: "Roomtone et ventilation feutrée (CC0 Public Domain - Wikimedia Commons)"
  },
  {
    filename: "01_clavier_lointain_REAL.ogg",
    url: "https://upload.wikimedia.org/wikipedia/commons/e/e9/Computer_keyboard_typing.ogg",
    desc: "Frappe de touches informatique (CC0 Public Domain - Wikimedia Commons)"
  },
  {
    filename: "02_photocopieuse_lointaine_REAL.ogg",
    url: "https://upload.wikimedia.org/wikipedia/commons/5/52/Printer_running.ogg",
    desc: "Impression et défilement mécanique (CC-BY 3.0 - Wikimedia Commons)"
  },
  {
    filename: "03_porte_feutree_REAL.ogg",
    url: "https://upload.wikimedia.org/wikipedia/commons/7/77/Door_closing_sound.ogg",
    desc: "Porte de bureau se refermant (CC0 Public Domain - Wikimedia Commons)"
  },
  {
    filename: "04_tasse_cafe_bureau_REAL.ogg",
    url: "https://upload.wikimedia.org/wikipedia/commons/a/a2/Ceramic_cup_clink.ogg",
    desc: "Tasse et soucoupe céramique (CC0 Public Domain - Wikimedia Commons)"
  },
  {
    filename: "05_papier_classeur_REAL.ogg",
    url: "https://upload.wikimedia.org/wikipedia/commons/4/4c/Paper_rustle_document.ogg",
    desc: "Feuilletage de dossier papier (CC0 Public Domain - Wikimedia Commons)"
  },
  {
    filename: "06_telephone_lointain_REAL.ogg",
    url: "https://upload.wikimedia.org/wikipedia/commons/d/d4/Phone_ring_retro_office.ogg",
    desc: "Sonnerie téléphonique lointaine (CC0 Public Domain - Wikimedia Commons)"
  }
];

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    let settled = false;
    let fileStream = null;
    const client = url.startsWith("https") ? https : http;

    const cleanupAndReject = (err) => {
      if (settled) return;
      settled = true;
      if (fileStream) {
        fileStream.close(() => {
          try { if (fs.existsSync(destPath)) fs.unlinkSync(destPath); } catch (_) {}
          reject(err);
        });
      } else {
        try { if (fs.existsSync(destPath)) fs.unlinkSync(destPath); } catch (_) {}
        reject(err);
      }
    };

    const request = client.get(url, { headers: { "User-Agent": "PlaceBeauvau-AudioKit/1.0" } }, (res) => {
      // Suivre les redirections HTTP 301 / 302
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        settled = true;
        return downloadFile(res.headers.location, destPath).then(resolve).catch(reject);
      }

      if (res.statusCode !== 200) {
        return cleanupAndReject(new Error(`Code HTTP ${res.statusCode}`));
      }

      fileStream = fs.createWriteStream(destPath);
      res.pipe(fileStream);

      fileStream.on("finish", () => {
        if (settled) return;
        settled = true;
        fileStream.close(() => resolve(destPath));
      });

      fileStream.on("error", (err) => {
        cleanupAndReject(err);
      });
    });

    request.on("error", (err) => {
      cleanupAndReject(err);
    });

    request.setTimeout(8000, () => {
      request.destroy();
      cleanupAndReject(new Error("Timeout réseau"));
    });
  });
}

async function run() {
  let successCount = 0;
  for (const sample of SAMPLES) {
    const dest = path.join(targetDir, sample.filename);
    process.stdout.write(`Téléchargement de ${sample.filename} (${sample.desc})... `);
    try {
      await downloadFile(sample.url, dest);
      console.log("✓ OK");
      successCount++;
    } catch (err) {
      console.log(`⚠️ Échec (${err.message}). Utilisation des maquettes DEMO.`);
      const demoPath = path.resolve("public/audio/demo", sample.filename.replace("_REAL.ogg", "_DEMO.ogg"));
      if (fs.existsSync(demoPath)) {
        fs.copyFileSync(demoPath, dest);
        console.log(`   -> Copie de secours créée dans public/audio/real/${sample.filename}`);
      }
    }
  }

  console.log(`\nOpération terminée : ${successCount}/${SAMPLES.length} fichiers authentiques récupérés.`);
  console.log("Consultez CREDITS.md pour les licences et attributions complètes.");
}

run();
