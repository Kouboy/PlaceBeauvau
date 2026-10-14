import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const targetDemoDir = path.resolve("public/audio/demo");
const targetRealDir = path.resolve("public/audio/real");

for (const dir of [targetDemoDir, targetRealDir]) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

console.log("=== GÉNÉRATION DES MICRO-ÉVÉNEMENTS AUDIO NETS ET RÉALISTES ===");

// 1. Roomtone feutré (20s) - Base d'ambiance propre et stable avec ventilateur P4 et néon discret
const roomtoneCmd = `ffmpeg -y -f lavfi -i "anoisesrc=c=pink:r=44100:a=0.04" \
  -f lavfi -i "sine=frequency=50:r=44100" \
  -f lavfi -i "sine=frequency=68:r=44100" \
  -filter_complex "\
    [0:a]lowpass=f=420:p=1.5,volume=0.5[air]; \
    [1:a]volume=0.015[hum50]; \
    [2:a]volume=0.012[vibe]; \
    [air][hum50][vibe]amix=inputs=3:duration=first:dropout_transition=2,volume=0.6[mix]; \
    [mix]afade=t=in:ss=0:d=0.8,afade=t=out:st=19.2:d=0.8[out]" \
  -map "[out]" -t 20 -c:a libvorbis -q:a 4`;

// 2. Clavier collègue (3.2s) : Vraie cadence dactylographique avec touches plastiques bien audibles
const clavierCmd = `ffmpeg -y \
  -f lavfi -i "anoisesrc=c=white:r=44100:a=0.3" \
  -f lavfi -i "sine=frequency=1600:r=44100" \
  -filter_complex "\
    [0:a]bandpass=f=2400:w=1200,volume=0.8[click]; \
    [1:a]volume=0.08[res]; \
    [click][res]amix=inputs=2,agate=threshold=0.02:range=0.001:attack=1:release=25:detection=peak[keyed]; \
    [keyed]tremolo=f=7:d=0.9,volume=1.4[typing]; \
    [typing]afade=t=in:ss=0:d=0.15,afade=t=out:st=2.7:d=0.5[out]" \
  -map "[out]" -t 3.2 -c:a libvorbis -q:a 4`;

// 3. Photocopieuse / Imprimante matricielle-laser (4.5s) : Moteur d'entraînement + passage de feuille net
const photocopieuseCmd = `ffmpeg -y \
  -f lavfi -i "sine=frequency=220:r=44100" \
  -f lavfi -i "anoisesrc=c=pink:r=44100:a=0.18" \
  -f lavfi -i "sine=frequency=880:r=44100" \
  -filter_complex "\
    [0:a]volume=0.18,tremolo=f=12:d=0.6[motor]; \
    [1:a]bandpass=f=1200:w=600,volume=0.5,tremolo=f=4:d=0.5[paper]; \
    [2:a]volume=0.04,afade=t=in:ss=0:d=0.05,afade=t=out:st=0.05:d=0.15[beep]; \
    [motor][paper][beep]amix=inputs=3:duration=first,volume=1.1[mix]; \
    [mix]afade=t=in:ss=0:d=0.3,afade=t=out:st=3.8:d=0.7[out]" \
  -map "[out]" -t 4.5 -c:a libvorbis -q:a 4`;

// 4. Porte de bureau (1.5s) : Clic mécanique de poignée puis claquement sec feutré avec chambranle
const porteCmd = `ffmpeg -y \
  -f lavfi -i "sine=frequency=320:r=44100" \
  -f lavfi -i "anoisesrc=c=brown:r=44100:a=0.4" \
  -f lavfi -i "sine=frequency=1400:r=44100" \
  -filter_complex "\
    [2:a]volume=0.15,afade=t=in:ss=0:d=0.01,afade=t=out:st=0.01:d=0.08[latch]; \
    [0:a]volume=0.35,afade=t=in:ss=0.1:d=0.02,afade=t=out:st=0.12:d=0.35[thud]; \
    [1:a]lowpass=f=400,volume=0.7,afade=t=in:ss=0.09:d=0.02,afade=t=out:st=0.11:d=0.45[reverb]; \
    [latch][thud][reverb]amix=inputs=3:duration=first,volume=1.2[out]" \
  -map "[out]" -t 1.5 -c:a libvorbis -q:a 4`;

// 5. Tasse de café sur coupelle (1.2s) : Tintement net de porcelaine (2100Hz + 3300Hz) et frottement cuillère
const tasseCmd = `ffmpeg -y \
  -f lavfi -i "sine=frequency=2150:r=44100" \
  -f lavfi -i "sine=frequency=3420:r=44100" \
  -f lavfi -i "anoisesrc=c=white:r=44100:a=0.06" \
  -filter_complex "\
    [0:a]volume=0.25,afade=t=in:ss=0:d=0.005,afade=t=out:st=0.01:d=0.45[ring1]; \
    [1:a]volume=0.15,afade=t=in:ss=0:d=0.005,afade=t=out:st=0.01:d=0.35[ring2]; \
    [2:a]bandpass=f=3000:w=1000,volume=0.12,afade=t=in:ss=0.15:d=0.05,afade=t=out:st=0.25:d=0.35[stir]; \
    [ring1][ring2][stir]amix=inputs=3:duration=first,volume=1.2[out]" \
  -map "[out]" -t 1.2 -c:a libvorbis -q:a 4`;

// 6. Papier & classeur administratif (2.2s) : Feuilletage net + fermeture sèche des anneaux métalliques
const papierCmd = `ffmpeg -y \
  -f lavfi -i "anoisesrc=c=pink:r=44100:a=0.3" \
  -f lavfi -i "sine=frequency=950:r=44100" \
  -filter_complex "\
    [0:a]bandpass=f=1800:w=1200,volume=0.65,afade=t=in:ss=0:d=0.1,afade=t=out:st=0.8:d=0.4[rustle]; \
    [1:a]volume=0.3,afade=t=in:ss=0.85:d=0.01,afade=t=out:st=0.86:d=0.15[snap]; \
    [rustle][snap]amix=inputs=2:duration=first,volume=1.3[out]" \
  -map "[out]" -t 2.2 -c:a libvorbis -q:a 4`;

// 7. Téléphone standard administratif (3.0s) : Sonnerie bitonale vintage (800Hz / 1000Hz) parfaitement audible
const telephoneCmd = `ffmpeg -y \\
  -f lavfi -i "sine=frequency=800:r=44100" \\
  -f lavfi -i "sine=frequency=1000:r=44100" \\
  -filter_complex "\\
    [0:a][1:a]amix=inputs=2,volume=0.35[tone]; \\
    [tone]tremolo=f=14:d=0.85,volume=1.2,asplit=2[w1][w2]; \\
    [w1]afade=t=in:ss=0:d=0.04,afade=t=out:st=0.9:d=0.15[ring1]; \\
    [w2]afade=t=in:ss=1.4:d=0.04,afade=t=out:st=2.5:d=0.25[ring2]; \\
    [ring1][ring2]amix=inputs=2:duration=first,volume=1.4[out]" \\
  -map "[out]" -t 3.0 -c:a libvorbis -q:a 4`;

// 8. Tampon collègue voisin (1.0s) : Impact d'encreur sec et franc dans un bureau voisin
const tamponVoisinCmd = `ffmpeg -y \
  -f lavfi -i "sine=frequency=240:r=44100" \
  -f lavfi -i "anoisesrc=c=white:r=44100:a=0.35" \
  -filter_complex "\
    [0:a]volume=0.45,afade=t=in:ss=0:d=0.005,afade=t=out:st=0.01:d=0.22[thump]; \
    [1:a]bandpass=f=1800:w=800,volume=0.55,afade=t=in:ss=0:d=0.005,afade=t=out:st=0.01:d=0.12[clack]; \
    [thump][clack]amix=inputs=2:duration=first,volume=1.2[out]" \
  -map "[out]" -t 1.0 -c:a libvorbis -q:a 4`;

// 9. Agrafeuse métallique de bureau (0.8s) : Claquement sec et net des griffes métalliques
const agrafeuseCmd = `ffmpeg -y \
  -f lavfi -i "sine=frequency=1850:r=44100" \
  -f lavfi -i "anoisesrc=c=white:r=44100:a=0.4" \
  -filter_complex "\
    [0:a]volume=0.3,afade=t=in:ss=0:d=0.005,afade=t=out:st=0.01:d=0.1[click]; \
    [1:a]bandpass=f=2600:w=1400,volume=0.7,afade=t=in:ss=0:d=0.005,afade=t=out:st=0.01:d=0.18[clinch]; \
    [click][clinch]amix=inputs=2:duration=first,volume=1.3[out]" \
  -map "[out]" -t 0.8 -c:a libvorbis -q:a 4`;

const samples = [
  { file: "00_roomtone_feutre_DEMO.ogg", cmd: roomtoneCmd },
  { file: "01_clavier_lointain_DEMO.ogg", cmd: clavierCmd },
  { file: "02_photocopieuse_lointaine_DEMO.ogg", cmd: photocopieuseCmd },
  { file: "03_porte_feutree_DEMO.ogg", cmd: porteCmd },
  { file: "04_tasse_cafe_bureau_DEMO.ogg", cmd: tasseCmd },
  { file: "05_papier_classeur_DEMO.ogg", cmd: papierCmd },
  { file: "06_telephone_lointain_DEMO.ogg", cmd: telephoneCmd },
  { file: "07_tampon_voisin_DEMO.ogg", cmd: tamponVoisinCmd },
  { file: "08_agrafeuse_DEMO.ogg", cmd: agrafeuseCmd },
];

for (const { file, cmd } of samples) {
  const demoPath = path.join(targetDemoDir, file);
  const realFile = file.replace("_DEMO.ogg", "_REAL.ogg");
  const realPath = path.join(targetRealDir, realFile);

  try {
    execSync(`${cmd} "${demoPath}"`, { stdio: "pipe" });
    fs.copyFileSync(demoPath, realPath);
    console.log(`✓ [OK] Généré : ${file} & ${realFile}`);
  } catch (err) {
    console.error(`✗ Erreur lors de la génération de ${file} :`, err);
  }
}

console.log("\n✓ Tous les micro-événements audio ont été générés avec clarté et présence !");
