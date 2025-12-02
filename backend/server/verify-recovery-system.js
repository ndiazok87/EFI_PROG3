import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { sequelize, User } from './src/models/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

console.log('🔍 Verificación Completa del Sistema de Recuperación\n');
console.log('='.repeat(60));

async function verify() {
    // 1. Check environment variables
    console.log('\n1️⃣  Variables de Entorno');
    console.log('-'.repeat(60));

    const apiKey = process.env.SENDGRID_API_KEY;
    const fromEmail = process.env.SENDGRID_FROM;
    const frontendUrl = process.env.FRONTEND_URL;

    console.log(`SENDGRID_API_KEY: ${apiKey ? '✅ Configurada' : '❌ NO configurada'}`);
    console.log(`SENDGRID_FROM: ${fromEmail || '❌ NO configurado'}`);
    console.log(`FRONTEND_URL: ${frontendUrl || 'http://localhost:5173 (default)'}`);

    if (!apiKey || apiKey === 'PONER_TU_CLAVE_AQUI') {
        console.log('\n⚠️  API Key no válida. Reinicia el servidor para cargar el nuevo .env');
        console.log('   Presiona Ctrl+C y ejecuta: npm run dev');
    }

    // 2. Check database connection
    console.log('\n2️⃣  Conexión a Base de Datos');
    console.log('-'.repeat(60));

    try {
        await sequelize.authenticate();
        console.log('✅ Conectado a la base de datos');
    } catch (error) {
        console.log('❌ Error de conexión:', error.message);
        return;
    }

    // 3. List users
    console.log('\n3️⃣  Usuarios Registrados');
    console.log('-'.repeat(60));

    try {
        const users = await User.findAll({
            attributes: ['id', 'email', 'created_at'],
            limit: 10
        });

        if (users.length === 0) {
            console.log('⚠️  No hay usuarios registrados');
            console.log('\n📝 Para probar la recuperación, primero registra un usuario:');
            console.log('   1. Ve a: http://localhost:8080/auth');
            console.log('   2. Regístrate con tu email');
            console.log('   3. Luego prueba la recuperación de contraseña');
        } else {
            console.log(`✅ Encontrados ${users.length} usuario(s):\n`);
            users.forEach((user, index) => {
                console.log(`   ${index + 1}. ${user.email}`);
                console.log(`      ID: ${user.id}`);
                console.log(`      Creado: ${new Date(user.created_at).toLocaleString()}\n`);
            });

            // Check if the test email exists
            const testUser = users.find(u => u.email === fromEmail);
            if (testUser) {
                console.log(`✅ El email ${fromEmail} está registrado`);
                console.log('   Puedes usar este email para probar la recuperación');
            } else {
                console.log(`⚠️  El email ${fromEmail} NO está registrado`);
                console.log('   Debes registrarlo primero o usar otro email registrado');
            }
        }
    } catch (error) {
        console.log('❌ Error al consultar usuarios:', error.message);
    }

    // 4. Test SendGrid
    console.log('\n4️⃣  Prueba de SendGrid');
    console.log('-'.repeat(60));

    if (!apiKey || apiKey === 'PONER_TU_CLAVE_AQUI') {
        console.log('⚠️  Saltando prueba (API Key no válida)');
    } else {
        try {
            const sg = await import('@sendgrid/mail');
            const sgClient = sg.default || sg;
            sgClient.setApiKey(apiKey);

            console.log('✅ SendGrid configurado correctamente');
            console.log('   (No se enviará email en esta verificación)');
        } catch (error) {
            console.log('❌ Error al configurar SendGrid:', error.message);
        }
    }

    // 5. Recommendations
    console.log('\n5️⃣  Recomendaciones');
    console.log('-'.repeat(60));

    const checks = {
        envConfigured: apiKey && apiKey !== 'PONER_TU_CLAVE_AQUI',
        hasUsers: (await User.count()) > 0,
        emailRegistered: (await User.findOne({ where: { email: fromEmail } })) !== null
    };

    if (checks.envConfigured && checks.hasUsers && checks.emailRegistered) {
        console.log('✅ ¡Todo está listo!');
        console.log('\n📧 Para probar la recuperación:');
        console.log('   1. Ve a: http://localhost:8080/forgot-password');
        console.log(`   2. Ingresa: ${fromEmail}`);
        console.log('   3. Click en "Enviar"');
        console.log('   4. Revisa tu email (y carpeta de spam)');
    } else {
        console.log('⚠️  Acciones necesarias:\n');

        if (!checks.envConfigured) {
            console.log('   🔴 Reinicia el servidor para cargar las variables de entorno');
            console.log('      Presiona Ctrl+C y ejecuta: npm run dev\n');
        }

        if (!checks.hasUsers) {
            console.log('   🔴 Registra al menos un usuario');
            console.log('      Ve a: http://localhost:8080/auth\n');
        }

        if (checks.hasUsers && !checks.emailRegistered) {
            console.log(`   🟡 El email ${fromEmail} no está registrado`);
            console.log('      Regístralo o usa otro email de la lista\n');
        }
    }

    console.log('\n' + '='.repeat(60));
    console.log('Verificación completada\n');

    process.exit(0);
}

verify().catch(error => {
    console.error('Error fatal:', error);
    process.exit(1);
});
