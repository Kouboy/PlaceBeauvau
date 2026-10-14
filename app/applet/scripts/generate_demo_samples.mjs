import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const targetDir = path.resolve("public/audio/demo");
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

console.log("Génération des fichiers audio de démonstration pour le Kit A1 dans :", targetDir);

// 1. 00_roomtone_feutre_DEMO.ogg : 20 secondes de silence administratif feutré, boucle sans raccord
const roomtoneCmd = `ffmpeg -y -f lavfi -i "anoisesrc=c=brown:r=44100:a=0.08" \
  -f lavfi -i "sine=frequency=50:r=44100" \
  -f lavfi -i "sine=frequency=100:r=44100" \
  -f lavfi -i "sine=frequency=65:r=44100" \
  -filter_complex "\
    [0:a]lowpass=f=280:p=2,volume=0.45[fan]; \
    [1:a]volume=0.015[hum50]; \
    [2:a]volume=0.005[hum100]; \
    [3:a]volume=0.02[chassis]; \
    [fan][hum50][hum100][chassis]amix=inputs=4:duration=first:dropout_transition=2,volume=0.7[mix]; \
    [mix]afade=t=in:ss=0:d=1,afade=t=out:st=19:d=1[out]" \
  -map "[out]" -t 20 -c:a libvorbis -q:a 3 "${targetDir}/00_roomtone_feutre_DEMO.ogg"`;

// 2. 01_clavier_lointain_DEMO.ogg : Cliquetis étouffé d'un clavier à membrane dans un bureau voisin
const clavierCmd = `ffmpeg -y \
  -f lavfi -i "anoisesrc=c=pink:r=44100:a=0.15" \
  -filter_complex "\
    [0:a]lowpass=f=650:p=2,agate=threshold=0.04:range=0.01:attack=2:release=40,volume=0.35,aecho=0.8:0.7:60|120:0.3|0.2[echo]; \
    [echo]afade=t=in:ss=0:d=0.2,afade=t=out:st=2.5:d=0.5[out]" \
  -map "[out]" -t 3 -c:a libvorbis -q:a 3 "${targetDir}/01_clavier_lointain_DEMO.ogg"`;

// 3. 02_photocopieuse_lointaine_DEMO.ogg : Ronronnement mécanique d'imprimante réseau au fond du couloir
const photocopieuseCmd = `ffmpeg -y \
  -f lavfi -i "sine=frequency=180:r=44100" \
  -f lavfi -i "anoisesrc=c=white:r=44100:a=0.05" \
  -filter_complex "\
    [0:a]volume=0.06[motor]; \
    [1:a]bandpass=f=400:w=120,volume=0.35[roller]; \
    [motor][roller]amix=inputs=2:duration=first,lowpass=f=450:p=2[mix]; \
    [mix]afade=t=in:ss=0:d=0.8,afade=t=out:st=3.2:d=0.8[out]" \
  -map "[out]" -t 4 -c:a libvorbis -q:a 3 "${targetDir}/02_photocopieuse_lointaine_DEMO.ogg"`;

// 4. 03_porte_feutree_DEMO.ogg : Fermeture étouffée d'une porte de bureau sur joint caoutchouc
const porteCmd = `ffmpeg -y \
  -f lavfi -i "anoisesrc=c=brown:r=44100:a=0.3" \
  -filter_complex "\
    [0:a]lowpass=f=160:p=2,volume=0.5,afade=t=in:ss=0:d=0.05,afade=t=out:st=0.15:d=0.85[out]" \
  -map "[out]" -t 1.2 -c:a libvorbis -q:a 3 "${targetDir}/03_porte_feutree_DEMO.ogg"`;

// 5. 04_tasse_cafe_bureau_DEMO.ogg : Petit tintement feutré de céramique sur soucoupe
const tasseCmd = `ffmpeg -y \
  -f lavfi -i "sine=frequency=1480:r=44100" \
  -f lavfi -i "sine=frequency=2960:r=44100" \
  -filter_complex "\
    [0:a]volume=0.08,afade=t=out:st=0.02:d=0.25[ring1]; \
    [1:a]volume=0.03,afade=t=out:st=0.01:d=0.15[ring2]; \
    [ring1][ring2]amix=inputs=2:duration=first,lowpass=f=1800,volume=0.25[out]" \
  -map "[out]" -t 1.0 -c:a libvorbis -q:a 3 "${targetDir}/04_tasse_cafe_bureau_DEMO.ogg"`;

// 6. 05_papier_classeur_DEMO.ogg : Feuilletage feutré d'une chemise cartonnée
const papierCmd = `ffmpeg -y \
  -f lavfi -i "anoisesrc=c=pink:r=44100:a=0.12" \
  -filter_complex "\
    [0:a]bandpass=f=800:w=400,volume=0.4,afade=t=in:ss=0:d=0.2,afade=t=out:st=1.2:d=0.6[out]" \
  -map "[out]" -t 2.0 -c:a libvorbis -q:a 3 "${targetDir}/05_papier_classeur_DEMO.ogg"`;

// 7. 06_telephone_lointain_DEMO.ogg : Sonnerie étouffée de téléphone derrière une cloison fermée
const telephoneCmd = `ffmpeg -y \
  -f lavfi -i "sine=frequency=750:r=44100" \
  -f lavfi -i "sine=frequency=950:r=44100" \
  -filter_complex "\
    [0:a][1:a]amix=inputs=2,volume=0.06,lowpass=f=750,aecho=0.8:0.6:80:0.3[bell]; \
    [bell]afade=t=in:ss=0:d=0.1,afade=t=out:st=1.8:d=0.4[out]" \
  -map "[out]" -t 2.2 -c:a libvorbis -q:a 3 "${targetDir}/06_telephone_lointain_DEMO.ogg"`;

const cmds = [
  { name: "00_roomtone_feutre_DEMO.ogg", cmd: roomtoneCmd },
  { name: "01_clavier_lointain_DEMO.ogg", cmd: clavierCmd },
  { name: "02_photocopieuse_lointaine_DEMO.ogg", cmd: photocopieuseCmd },
  { name: "03_porte_feutree_DEMO.ogg", cmd: porteCmd },
  { name: "04_tasse_cafe_bureau_DEMO.ogg", cmd: tasseCmd },
  { name: "05_papier_classeur_DEMO.ogg", cmd: papierCmd },
  { name: "06_telephone_lointain_DEMO.ogg", cmd: telephoneCmd }
];

for (const { name, cmd } of cmds) {
  try {
    execSync(cmd, { stdio: "pipe" });
    console.log("✓ Généré avec succès :", name);
  } catch (err) {
    console.error("Erreur lors de la génération de :", name, err);
  }
}

console.log("Génération du Kit A1 terminée.");
