const http = require('http');

const request = (method, path, body = null, token = null) => {
    return new Promise((resolve) => {
        const options = {
            hostname: 'localhost',
            port: 5000,
            path: `/api${path}`,
            method: method,
            headers: { 'Content-Type': 'application/json' }
        };
        if (token) options.headers['Authorization'] = `Bearer ${token}`;

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', c => data += c);
            res.on('end', () => resolve({ status: res.statusCode, body: data }));
        });
        req.on('error', (e) => resolve({ status: 500, error: e.message }));
        if (body) req.write(JSON.stringify(body));
        req.end();
    });
};

const runAudit = async () => {
    console.log("--- STARTING API AUDIT ---");

    // 1. Auth Headers
    console.log("1. Testing Auth...");
    const login = await request('POST', '/auth/login', { email: 'admin@university.edu', password: '123456' });
    if (login.status !== 200) {
        console.error("   [FAIL] Admin Login Failed");
        process.exit(1);
    }
    const token = JSON.parse(login.body).token;
    console.log("   [PASS] Admin Login");

    // 2. Admin Routes
    console.log("2. Testing Admin Routes...");
    const users = await request('GET', '/admin/users', null, token);
    console.log(`   [${users.status === 200 ? 'PASS' : 'FAIL'}] GET /admin/users`);

    const leaves = await request('GET', '/admin/leaves', null, token);
    console.log(`   [${leaves.status === 200 ? 'PASS' : 'FAIL'}] GET /admin/leaves`);

    // 3. Task Routes
    console.log("3. Testing Task Routes...");
    const tasks = await request('GET', '/tasks', null, token);
    console.log(`   [${tasks.status === 200 ? 'PASS' : 'FAIL'}] GET /tasks`);

    // 4. Create Task (Data Flow)
    const newTask = await request('POST', '/tasks', {
        title: "AUDIT TASK",
        description: "Automated Audit",
        assignedTo: "2", // Faculty CS
        deadline: "2026-12-31"
    }, token);
    console.log(`   [${newTask.status === 201 ? 'PASS' : 'FAIL'}] POST /tasks`);

    console.log("--- AUDIT COMPLETE ---");
};

runAudit();
