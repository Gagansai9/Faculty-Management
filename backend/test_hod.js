const API_URL = 'http://localhost:5000/api/auth';

async function testHODFlow() {
    console.log('--- Starting HOD Auth Flow Test ---');

    // 1. Register HOD
    const uniqueEmail = `hod_${Date.now()}@uni.edu`;
    const userPayload = {
        name: 'Prof. HOD',
        email: uniqueEmail,
        password: 'password123',
        role: 'hod',
        department: 'CS'
    };

    try {
        console.log(`\n1. Attempting Register (HOD) with ${uniqueEmail}...`);
        const regRes = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userPayload)
        });

        if (!regRes.ok) {
            const err = await regRes.json();
            throw new Error(err.message || regRes.statusText);
        }

        const regData = await regRes.json();
        console.log('✅ HOD Registration Success:', regData.role);
        // Expect role to be 'hod'

    } catch (err) {
        console.error('❌ HOD Registration Failed:', err.message);
        return;
    }

    // 2. Login HOD
    try {
        console.log(`\n2. Attempting Login (HOD)...`);
        const loginRes = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: uniqueEmail,
                password: 'password123'
            })
        });

        if (!loginRes.ok) {
            const err = await loginRes.json();
            throw new Error(err.message || loginRes.statusText);
        }

        const loginData = await loginRes.json();
        console.log('✅ HOD Login Success:', loginData.role);
        console.log('   Token:', !!loginData.token);
    } catch (err) {
        console.error('❌ HOD Login Failed:', err.message);
    }
}

testHODFlow();
