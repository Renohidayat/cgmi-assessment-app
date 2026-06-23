const { execSync } = require('child_process');

const keyPath = 'C:\\Users\\KAPAL LAWD\\Downloads\\cgmi-assessment-firebase-adminsdk-fbsvc-4ecdf102e7.json';

process.env.GOOGLE_APPLICATION_CREDENTIALS = keyPath;

const cmd = process.argv[2] || 'firebase projects:list';
console.log('Menjalankan:', cmd);

try {
  const output = execSync(cmd, { 
    encoding: 'utf8',
    env: { ...process.env, GOOGLE_APPLICATION_CREDENTIALS: keyPath }
  });
  console.log(output);
} catch (e) {
  console.error(e.stdout || e.stderr || e.message);
}