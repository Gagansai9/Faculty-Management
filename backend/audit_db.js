const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const TASKS_FILE = path.join(DATA_DIR, 'tasks.json');
const LEAVES_FILE = path.join(DATA_DIR, 'leaves.json');

const load = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));

console.log("--- STARTING DATABASE AUDIT ---");

try {
    const users = load(USERS_FILE);
    const tasks = load(TASKS_FILE);
    const leaves = load(LEAVES_FILE);

    console.log(`[INFO] Users: ${users.length}, Tasks: ${tasks.length}, Leaves: ${leaves.length}`);

    // 1. Validate Users
    const userIds = new Set(users.map(u => u._id));
    users.forEach(u => {
        if (!u.role) console.error(`[ERROR] User ${u._id} missing role!`);
        if (!u.email) console.error(`[ERROR] User ${u._id} missing email!`);
    });

    // 2. Validate Tasks (Orphans)
    let taskIssues = 0;
    tasks.forEach(t => {
        if (t.assignedTo && !userIds.has(t.assignedTo)) {
            console.error(`[ERROR] Task ${t._id} assigned to non-existent user (${t.assignedTo})`);
            taskIssues++;
        }
        if (t.assignedBy && !userIds.has(t.assignedBy)) {
            console.error(`[ERROR] Task ${t._id} created by non-existent user (${t.assignedBy})`);
            taskIssues++;
        }
    });
    if (taskIssues === 0) console.log("[PASS] No orphaned tasks found.");

    // 3. Validate Leaves (Orphans)
    let leaveIssues = 0;
    leaves.forEach(l => {
        if (!userIds.has(l.user)) {
            console.error(`[ERROR] Leave ${l._id} belongs to non-existent user (${l.user})`);
            leaveIssues++;
        }
    });
    if (leaveIssues === 0) console.log("[PASS] No orphaned leaves found.");

    console.log("--- AUDIT COMPLETE ---");

} catch (e) {
    console.error("[CRITICAL] Failed to load DB files:", e.message);
}
