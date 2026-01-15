const fs = require('fs');
const bcrypt = require('bcryptjs');

const password = '123456';
const salt = bcrypt.genSaltSync(10);
const hash = bcrypt.hashSync(password, salt);

fs.writeFileSync('hash.txt', hash);
console.log('Hash written to hash.txt');
