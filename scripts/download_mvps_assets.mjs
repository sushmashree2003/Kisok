import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const BASE_URL = 'https://madhuvanvatika.org';

const ASSETS = [
  // 1. BRAND
  {
    url: `${BASE_URL}/assets/images/madhuvan_vatika_logo-removebg-preview.png`,
    dest: 'public/mvps/brand/logo.png',
  },
  {
    url: `${BASE_URL}/assets/images/favicon.ico`,
    dest: 'public/mvps/brand/favicon.ico',
  },

  // 2. LEADERSHIP
  {
    url: `${BASE_URL}/assets/images/Chairmain%20Img.jpeg`,
    dest: 'public/mvps/leadership/chairman_amit_chadha.jpg',
  },
  {
    url: `${BASE_URL}/assets/images/shared%20image%20(4).jfif`,
    dest: 'public/mvps/leadership/principal_deepak_puri.jpg',
  },
  {
    url: `${BASE_URL}/assets/images/chairman2.jpeg`,
    dest: 'public/mvps/leadership/vice_chairman_aman_chadha.jpg',
  },
  {
    url: `${BASE_URL}/assets/images/Keshav%20Sir_New.jpg`,
    dest: 'public/mvps/leadership/director_keshav_kumar.jpg',
  },

  // 3. FACILITIES
  {
    url: `${BASE_URL}/assets/images/classRoom1.jpg`,
    dest: 'public/mvps/facilities/classrooms_01.jpg',
  },
  {
    url: `${BASE_URL}/assets/images/classRoom2.jpg`,
    dest: 'public/mvps/facilities/classrooms_02.jpg',
  },
  {
    url: `${BASE_URL}/assets/images/shared%20image%20(29).jfif`,
    dest: 'public/mvps/facilities/classrooms_03.jpg',
  },
  {
    url: `${BASE_URL}/assets/images/IMG_0175.JPG`,
    dest: 'public/mvps/facilities/transport_buses.jpg',
  },
  {
    url: `${BASE_URL}/assets/images/Lab.jpg`,
    dest: 'public/mvps/facilities/labs.jpg',
  },
  {
    url: `${BASE_URL}/assets/images/Library1.jpg`,
    dest: 'public/mvps/facilities/library_01.jpg',
  },
  {
    url: `${BASE_URL}/assets/images/Library2.jpg`,
    dest: 'public/mvps/facilities/library_02.jpg',
  },
  {
    url: `${BASE_URL}/assets/images/8.JPG`,
    dest: 'public/mvps/facilities/sports_01.jpg',
  },
  {
    url: `${BASE_URL}/assets/images/IMG_0058.JPG`,
    dest: 'public/mvps/facilities/sports_02.jpg',
  },
  {
    url: `${BASE_URL}/assets/images/IMG_0098.JPG`,
    dest: 'public/mvps/facilities/sports_03.jpg',
  },
  {
    url: `${BASE_URL}/assets/images/IMG_9649.JPG`,
    dest: 'public/mvps/facilities/playarea_01.jpg',
  },
  {
    url: `${BASE_URL}/assets/images/IMG_0103.JPG`,
    dest: 'public/mvps/facilities/playarea_02.jpg',
  },

  // 4. HERO & BANNERS
  {
    url: `${BASE_URL}/assets/images/1001945508.jpg`,
    dest: 'public/mvps/hero/banner_01.jpg',
  },
  {
    url: `${BASE_URL}/assets/images/2.JPG`,
    dest: 'public/mvps/hero/banner_02.jpg',
  },
  {
    url: `${BASE_URL}/assets/images/IMG_9557.JPG`,
    dest: 'public/mvps/hero/banner_03.jpg',
  },
  {
    url: `${BASE_URL}/assets/images/IMG_9427.JPG`,
    dest: 'public/mvps/hero/banner_04.jpg',
  },
  {
    url: `${BASE_URL}/assets/images/madhu.jpg`,
    dest: 'public/mvps/hero/campus_front.jpg',
  },

  // 5. GALLERY (EVENTS, SPORTS, ACADEMICS)
  {
    url: `${BASE_URL}/assets/images/madhu5.jpg`,
    dest: 'public/mvps/gallery/event_cultural_01.jpg',
  },
  {
    url: `${BASE_URL}/assets/images/madhu6.jpg`,
    dest: 'public/mvps/gallery/event_cultural_02.jpg',
  },
  {
    url: `${BASE_URL}/assets/images/madhu3.jpg`,
    dest: 'public/mvps/gallery/event_cultural_03.jpg',
  },
  {
    url: `${BASE_URL}/assets/images/img9.jpg`,
    dest: 'public/mvps/gallery/event_dance_01.jpg',
  },
  {
    url: `${BASE_URL}/assets/images/img12.jpg`,
    dest: 'public/mvps/gallery/event_celebration_01.jpg',
  },
  {
    url: `${BASE_URL}/assets/images/shared%20image%20(1).jfif`,
    dest: 'public/mvps/gallery/event_stage_01.jpg',
  },
  {
    url: `${BASE_URL}/assets/images/shared%20image%20(5).jfif`,
    dest: 'public/mvps/gallery/event_stage_02.jpg',
  },
  {
    url: `${BASE_URL}/assets/images/shared%20image%20(13).jfif`,
    dest: 'public/mvps/gallery/event_activity_01.jpg',
  },
  {
    url: `${BASE_URL}/assets/images/IMG_0012.JPG`,
    dest: 'public/mvps/gallery/sports_cricket_01.jpg',
  },
  {
    url: `${BASE_URL}/assets/images/IMG_9708.JPG`,
    dest: 'public/mvps/gallery/sports_athletics_01.jpg',
  },
  {
    url: `${BASE_URL}/assets/images/IMG_9668.JPG`,
    dest: 'public/mvps/gallery/sports_race_01.jpg',
  },
  {
    url: `${BASE_URL}/assets/images/1.JPG`,
    dest: 'public/mvps/gallery/academic_classroom_01.jpg',
  },
  {
    url: `${BASE_URL}/assets/images/4.JPG`,
    dest: 'public/mvps/gallery/academic_activity_01.jpg',
  },
];

async function downloadFile(url, destPath) {
  const fullDest = path.join(projectRoot, destPath);
  fs.mkdirSync(path.dirname(fullDest), { recursive: true });

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });

    if (!res.ok) {
      console.warn(`[WARN] Failed to fetch ${url} (Status: ${res.status} ${res.statusText})`);
      return false;
    }

    const buffer = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(fullDest, buffer);
    console.log(`[OK] ${destPath} (${(buffer.length / 1024).toFixed(1)} KB)`);
    return true;
  } catch (err) {
    console.error(`[ERROR] ${url}:`, err.message);
    return false;
  }
}

async function main() {
  console.log(`Starting asset download from ${BASE_URL}...`);
  console.log(`Total assets scheduled: ${ASSETS.length}\n`);

  let successCount = 0;
  for (const asset of ASSETS) {
    const ok = await downloadFile(asset.url, asset.dest);
    if (ok) successCount++;
  }

  console.log(`\nDownload completed: ${successCount} / ${ASSETS.length} assets retrieved successfully.`);
}

main();
