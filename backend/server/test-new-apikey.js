import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Forzar recarga del .env
delete process.env.SENDGRID_API_KEY;
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const apiKey = process.env.SENDGRID_API_KEY;
const fromEmail = process.env.SENDGRID_FROM || 'n.diaz@itecriocuarto.org.ar';

console.log('🧪 Probando nueva API Key de SendGrid\n');
console.log('='.repeat(60));

console.log('\n📋 Configuración:');
console.log(`   API Key: ${apiKey ? apiKey.substring(0, 25) + '...' : '❌ NO configurada'}`);
console.log(`   From: ${fromEmail}`);

if (!apiKey || !apiKey.startsWith('SG.')) {
    console.log('\n❌ API Key no válida o no cargada');
    console.log('   Asegúrate de REINICIAR el servidor backend');
    process.exit(1);
}

console.log('\n📧 Enviando email de prueba...');

try {
    const sg = await import('@sendgrid/mail');
    const sgClient = sg.default || sg;
    sgClient.setApiKey(apiKey);

    const msg = {
        to: fromEmail,
        from: fromEmail,
        subject: '✅ TEST: Nueva API Key de SendGrid Funcionando',
        text: 'Si recibes este email, la nueva API Key está funcionando correctamente.',
        html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
        <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h2 style="color: #4CAF50;">✅ Nueva API Key Configurada</h2>
          <p>¡Excelente! La nueva API Key de SendGrid está funcionando correctamente.</p>
          <p><strong>Fecha y hora:</strong> ${new Date().toLocaleString('es-AR')}</p>
          <p><strong>Sistema:</strong> Agro Precisión - Recuperación de Contraseña</p>
          <hr style="border: 1px solid #eee; margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">
            Este es un email de prueba enviado desde el backend de Agro Precisión.
          </p>
        </div>
      </div>
    `,
    };

    const response = await sgClient.send(msg);

    console.log('\n✅ ¡EMAIL ENVIADO EXITOSAMENTE!');
    console.log(`   Status: ${response[0].statusCode}`);
    console.log(`   Message ID: ${response[0].headers['x-message-id'] || 'N/A'}`);
    console.log(`\n📬 Revisa tu email: ${fromEmail}`);
    console.log('   Asunto: "✅ TEST: Nueva API Key de SendGrid Funcionando"');
    console.log('   (También revisa spam si no lo ves)');

    console.log('\n🎉 La API Key está funcionando correctamente');
    console.log('   Ahora puedes usar la recuperación de contraseña sin problemas');

} catch (error) {
    console.log('\n❌ Error al enviar email:');

    if (error.response) {
        console.log(`   Status: ${error.response.statusCode}`);
        console.log(`   Body: ${JSON.stringify(error.response.body, null, 2)}`);

        if (error.response.statusCode === 401) {
            console.log('\n🚨 Error 401: API Key aún inválida');
            console.log('   Posibles causas:');
            console.log('   1. La API Key fue revocada en SendGrid');
            console.log('   2. No tiene permisos de "Mail Send"');
            console.log('   3. Hay un error de tipeo');
        } else if (error.response.statusCode === 403) {
            console.log('\n🚨 Error 403: Email remitente no verificado');
            console.log(`   Verifica "${fromEmail}" en SendGrid Dashboard`);
        }
    } else {
        console.log(`   ${error.message}`);
    }
}

console.log('\n' + '='.repeat(60));
