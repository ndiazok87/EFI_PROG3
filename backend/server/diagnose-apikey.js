import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Diagnóstico de API Key de SendGrid\n');
console.log('='.repeat(60));

// Load .env file
const envPath = path.resolve(__dirname, '../.env');
dotenv.config({ path: envPath });

// Read .env file directly
const envContent = fs.readFileSync(envPath, 'utf8');

console.log('\n1️⃣  Análisis del archivo .env');
console.log('-'.repeat(60));

// Find SENDGRID_API_KEY line
const lines = envContent.split('\n');
const apiKeyLine = lines.find(line => line.trim().startsWith('SENDGRID_API_KEY='));

if (apiKeyLine) {
    console.log('✅ Línea encontrada en .env:');
    console.log(`   "${apiKeyLine}"`);

    // Extract the key
    const keyPart = apiKeyLine.split('=')[1];

    // Check for issues
    const issues = [];

    if (!keyPart) {
        issues.push('❌ No hay valor después del "="');
    } else {
        console.log(`\n   Valor extraído: "${keyPart}"`);
        console.log(`   Longitud: ${keyPart.length} caracteres`);

        // Check for whitespace
        if (keyPart !== keyPart.trim()) {
            issues.push('⚠️  Tiene espacios en blanco al inicio o final');
            console.log(`   Con trim: "${keyPart.trim()}"`);
            console.log(`   Longitud sin espacios: ${keyPart.trim().length}`);
        }

        // Check if starts with SG.
        const trimmedKey = keyPart.trim();
        if (!trimmedKey.startsWith('SG.')) {
            issues.push('❌ No empieza con "SG."');
            console.log(`   Los primeros 5 caracteres son: "${trimmedKey.substring(0, 5)}"`);
        } else {
            console.log(`   ✅ Empieza con "SG."`);
        }

        // Check length (typical SendGrid keys are ~69 chars)
        if (trimmedKey.length < 60 || trimmedKey.length > 100) {
            issues.push(`⚠️  Longitud inusual: ${trimmedKey.length} caracteres (esperado: ~69)`);
        }

        // Check for special characters that might be problematic
        if (trimmedKey.includes(' ')) {
            issues.push('❌ Contiene espacios en el medio');
        }
        if (trimmedKey.includes('\t')) {
            issues.push('❌ Contiene tabulaciones');
        }
        if (trimmedKey.includes('\r') || trimmedKey.includes('\n')) {
            issues.push('❌ Contiene saltos de línea');
        }
    }

    if (issues.length > 0) {
        console.log('\n🚨 Problemas detectados:');
        issues.forEach(issue => console.log(`   ${issue}`));
    } else {
        console.log('\n✅ La API key parece estar formateada correctamente');
    }
} else {
    console.log('❌ No se encontró SENDGRID_API_KEY en el archivo .env');
}

console.log('\n2️⃣  Variable de entorno cargada en Node.js');
console.log('-'.repeat(60));

const loadedKey = process.env.SENDGRID_API_KEY;
if (loadedKey) {
    console.log(`✅ Cargada en process.env`);
    console.log(`   Valor: "${loadedKey}"`);
    console.log(`   Longitud: ${loadedKey.length} caracteres`);
    console.log(`   Empieza con SG.: ${loadedKey.startsWith('SG.') ? '✅ Sí' : '❌ No'}`);

    if (apiKeyLine) {
        const fileKey = apiKeyLine.split('=')[1]?.trim();
        if (fileKey !== loadedKey) {
            console.log('\n⚠️  La clave en memoria es DIFERENTE a la del archivo .env');
            console.log('   🔄 Necesitas REINICIAR el servidor para cargar la nueva clave');
        }
    }
} else {
    console.log('❌ No está cargada en process.env');
}

console.log('\n3️⃣  Prueba de autenticación con SendGrid');
console.log('-'.repeat(60));

if (loadedKey && loadedKey.startsWith('SG.')) {
    try {
        const sg = await import('@sendgrid/mail');
        const sgClient = sg.default || sg;
        sgClient.setApiKey(loadedKey);

        // Try to send a validation request (will fail if key is invalid)
        try {
            // SendGrid doesn't have a simple "validate" endpoint, but we can try
            // to set the key and if it doesn't throw, it's at least formatted correctly
            console.log('✅ API Key aceptada por el cliente de SendGrid');
            console.log('   (Esto no garantiza que esté activa en SendGrid)');
        } catch (err) {
            console.log('❌ Error al configurar SendGrid:', err.message);
        }
    } catch (err) {
        console.log('❌ Error al importar @sendgrid/mail:', err.message);
    }
}

console.log('\n4️⃣  Recomendaciones');
console.log('-'.repeat(60));

console.log('\n🔧 Pasos para solucionar el error 401:');
console.log('\n1. Verifica en SendGrid Dashboard:');
console.log('   • Ve a: https://app.sendgrid.com/settings/api_keys');
console.log('   • Verifica que la API Key esté activa (no revocada)');
console.log('   • Verifica que tenga permisos "Mail Send"');
console.log('\n2. Si la clave fue revocada o expiró:');
console.log('   • Genera una NUEVA API Key en SendGrid');
console.log('   • Cópiala COMPLETA (sin espacios extras)');
console.log('   • Actualízala en el archivo .env');
console.log('   • REINICIA el servidor backend');
console.log('\n3. Formato correcto en .env:');
console.log('   SENDGRID_API_KEY=SG.xxxxxxxxxx.yyyyyyyyyyyy');
console.log('   (SIN espacios, SIN comillas)');

console.log('\n' + '='.repeat(60));
console.log('Diagnóstico completado\n');
