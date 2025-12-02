import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.resolve(__dirname, '../.env');
const apiKey = process.env.SENDGRID_API_KEY || "API_KEY_AQUI";

console.log('🔧 Actualizando SENDGRID_API_KEY en .env\n');
console.log('='.repeat(60));

try {
    // Read current .env
    let envContent = fs.readFileSync(envPath, 'utf8');

    console.log('✅ Archivo .env leído correctamente');

    // Replace the SENDGRID_API_KEY line
    const lines = envContent.split('\n');
    let updated = false;

    const newLines = lines.map(line => {
        if (line.trim().startsWith('SENDGRID_API_KEY=')) {
            updated = true;
            return `SENDGRID_API_KEY=${newApiKey}`;
        }
        return line;
    });

    if (!updated) {
        console.log('⚠️  SENDGRID_API_KEY no encontrada, agregándola...');
        // Find SendGrid section and add it
        const sendgridIndex = newLines.findIndex(line => line.includes('SendGrid'));
        if (sendgridIndex >= 0) {
            newLines.splice(sendgridIndex + 1, 0, `SENDGRID_API_KEY=${newApiKey}`);
        } else {
            newLines.push(`SENDGRID_API_KEY=${newApiKey}`);
        }
    }

    // Write back
    fs.writeFileSync(envPath, newLines.join('\n'), 'utf8');

    console.log('✅ API Key actualizada exitosamente');
    console.log(`   Nueva clave: ${newApiKey.substring(0, 20)}...`);
    console.log(`   Longitud: ${newApiKey.length} caracteres`);
    console.log(`   Formato: ${newApiKey.startsWith('SG.') ? '✅ Correcto' : '❌ Incorrecto'}`);

    console.log('\n⚠️  IMPORTANTE: Debes REINICIAR el servidor backend');
    console.log('   1. Ve a la terminal donde está corriendo');
    console.log('   2. Presiona Ctrl+C');
    console.log('   3. Ejecuta: npm run dev');

} catch (error) {
    console.error('❌ Error:', error.message);
}

console.log('\n' + '='.repeat(60));
