import fetch from 'node-fetch';

const API_URL = 'http://localhost:4000';
const TEST_EMAIL = 'n.diaz@itecriocuarto.org.ar';

console.log('🧪 Prueba de Recuperación de Contraseña\n');
console.log('='.repeat(50));

async function testPasswordRecovery() {
    try {
        console.log(`\n📧 Solicitando recuperación de contraseña para: ${TEST_EMAIL}`);
        console.log('Endpoint: POST /api/auth/forgot-password');

        const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: TEST_EMAIL
            })
        });

        const data = await response.json();

        console.log(`\nStatus: ${response.status} ${response.statusText}`);
        console.log(`Respuesta: ${JSON.stringify(data, null, 2)}`);

        if (response.ok) {
            console.log('\n✅ Solicitud procesada correctamente');
            console.log('\n📬 REVISA TU EMAIL:');
            console.log(`   Destinatario: ${TEST_EMAIL}`);
            console.log('   Asunto: "Restablecer contraseña"');
            console.log('\n⚠️  Si no lo ves:');
            console.log('   1. Revisa la carpeta de SPAM');
            console.log('   2. Revisa Promociones/Social');
            console.log('   3. Espera 1-2 minutos (puede tardar)');
            console.log('   4. Revisa los logs del servidor backend');
        } else {
            console.log('\n❌ Error en la solicitud');
        }

    } catch (error) {
        console.log('\n❌ Error de conexión:');
        console.log(error.message);
        console.log('\n⚠️  Asegúrate de que el servidor backend esté corriendo:');
        console.log('   cd backend');
        console.log('   npm run dev');
    }
}

// Verificar si el servidor está corriendo
async function checkServer() {
    try {
        const response = await fetch(`${API_URL}/api/auth/me`, {
            method: 'GET'
        });
        return true;
    } catch (error) {
        return false;
    }
}

// Main
(async () => {
    const serverRunning = await checkServer();

    if (!serverRunning) {
        console.log('\n❌ El servidor backend NO está corriendo');
        console.log('\n🚀 Inicia el servidor con:');
        console.log('   cd backend');
        console.log('   npm run dev');
        console.log('\n   Luego ejecuta este script nuevamente.');
        process.exit(1);
    }

    console.log('✅ Servidor backend corriendo en ' + API_URL);

    await testPasswordRecovery();

    console.log('\n' + '='.repeat(50));
    console.log('Prueba completada\n');
})();
