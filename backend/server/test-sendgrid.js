import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

console.log('🔍 Diagnóstico de SendGrid\n');
console.log('='.repeat(50));

// Check environment variables
const apiKey = process.env.SENDGRID_API_KEY;
const fromEmail = process.env.SENDGRID_FROM;
const frontendUrl = process.env.FRONTEND_URL;

console.log('\n📋 Variables de Entorno:');
console.log('------------------------');
console.log(`SENDGRID_API_KEY: ${apiKey ? '✅ Configurada (' + apiKey.substring(0, 15) + '...)' : '❌ NO configurada'}`);
console.log(`SENDGRID_FROM: ${fromEmail ? '✅ ' + fromEmail : '❌ NO configurado'}`);
console.log(`FRONTEND_URL: ${frontendUrl || 'http://localhost:5173 (default)'}`);

// Test SendGrid connection
if (apiKey) {
    console.log('\n📧 Probando conexión con SendGrid...');
    console.log('------------------------');

    try {
        const sg = await import('@sendgrid/mail');
        const sgClient = sg.default || sg;
        sgClient.setApiKey(apiKey);

        // Test email
        const testEmail = {
            to: fromEmail, // Enviar a ti mismo como prueba
            from: fromEmail,
            subject: '✅ Prueba de SendGrid - Agro Precisión',
            text: 'Este es un email de prueba para verificar que SendGrid está funcionando correctamente.',
            html: '<p>Este es un email de prueba para verificar que <strong>SendGrid está funcionando correctamente</strong>.</p><p>✅ Si recibes este email, la configuración es correcta.</p>',
        };

        console.log(`\nEnviando email de prueba a: ${fromEmail}...`);

        const response = await sgClient.send(testEmail);

        console.log('\n✅ ¡Email enviado exitosamente!');
        console.log(`Status Code: ${response[0].statusCode}`);
        console.log(`\n🎉 SendGrid está configurado correctamente.`);
        console.log(`📬 Revisa tu bandeja de entrada: ${fromEmail}`);
        console.log(`   (También revisa spam/correo no deseado)`);

    } catch (error) {
        console.log('\n❌ Error al enviar email:');
        console.log('------------------------');

        if (error.response) {
            console.log(`Status Code: ${error.response.statusCode}`);
            console.log(`Body: ${JSON.stringify(error.response.body, null, 2)}`);

            // Mensajes de error comunes
            if (error.response.statusCode === 401) {
                console.log('\n⚠️  Error 401: API Key inválida o expirada');
                console.log('   Solución: Verifica tu API Key en SendGrid Dashboard');
            } else if (error.response.statusCode === 403) {
                console.log('\n⚠️  Error 403: Acceso denegado');
                console.log('   Solución: Verifica que la API Key tenga permisos de "Mail Send"');
            } else if (error.response.body?.errors) {
                error.response.body.errors.forEach((err, index) => {
                    console.log(`\n❌ Error ${index + 1}: ${err.message}`);
                    if (err.field) console.log(`   Campo: ${err.field}`);
                });
            }
        } else {
            console.log(error.message || error);
        }

        console.log('\n📚 Pasos para solucionar:');
        console.log('1. Verifica que el email remitente esté verificado en SendGrid');
        console.log('2. Verifica que la API Key sea válida y tenga permisos');
        console.log('3. Revisa que no haya espacios en blanco en la API Key');
    }
} else {
    console.log('\n❌ No se puede probar SendGrid: API Key no configurada');
}

console.log('\n' + '='.repeat(50));
console.log('Diagnóstico completado\n');
