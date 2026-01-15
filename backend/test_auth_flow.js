const API_URL = 'http://localhost:5000/api/auth';

async function testAuth() {
    console.log('--- Starting Auth Flow Test (Fetch) ---');

    // 1. Register User
    const uniqueEmail = `test_${Date.now()}@uni.edu`;
    const userPayload = {
        name: 'Test Faculty',
        email: uniqueEmail,
        password: 'password123',
        role: 'lecturer',
        department: 'CS'
    };

    try {
        console.log(`\n1. Attempting Register with ${uniqueEmail}...`);
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
        console.log('✅ Registration Success:', regRes.status);
        console.log('   Token:', !!regData.token);
    } catch (err) {
        console.error('❌ Registration Failed:', err.message);
        return; // Stop if register fails
    }

    // 2. Login User
    try {
        console.log(`\n2. Attempting Login with ${uniqueEmail}...`);
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
        console.log('✅ Login Success:', loginRes.status);
        console.log('   Token:', !!loginData.token);
    } catch (err) {
        console.error('❌ Login Failed:', err.message);
    }

    // 3. Login with Wrong Password (expect 401)
    try {
        console.log(`\n3. Attempting Login with WRONG password...`);
        const loginFailRes = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: uniqueEmail,
                password: 'wrongpassword'
            })
        });

        if (loginFailRes.status === 401) {
            console.log('✅ Correctly rejected (401)');
        } else {
            console.error('❌ Failed: Expected 401, got', loginFailRes.status);
        }
    } catch (err) {
        console.error('❌ Unexpected Error:', err.message);
    }
}

testAuth();
