import https from 'https';
import fs from 'fs';
import path from 'path';

const publicImagesDir = path.resolve(process.cwd(), 'public/images');

if (!fs.existsSync(publicImagesDir)) {
  fs.mkdirSync(publicImagesDir, { recursive: true });
}

const images = [
  { url: 'https://picsum.photos/1200/600?random=1', name: 'hero-students.jpg' },
  { url: 'https://picsum.photos/800/600?random=2', name: 'college-1.jpg' },
  { url: 'https://picsum.photos/800/600?random=3', name: 'college-2.jpg' },
  { url: 'https://picsum.photos/800/600?random=4', name: 'college-3.jpg' }
];

images.forEach(({ url, name }) => {
  const filePath = path.join(publicImagesDir, name);
  https.get(url, (res) => {
    // Handle redirects
    if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
      https.get(res.headers.location, (redirectRes) => {
        const file = fs.createWriteStream(filePath);
        redirectRes.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`Downloaded ${name}`);
        });
      });
    } else {
      const file = fs.createWriteStream(filePath);
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded ${name}`);
      });
    }
  }).on('error', (err) => {
    console.error(`Error downloading ${name}:`, err.message);
  });
});
