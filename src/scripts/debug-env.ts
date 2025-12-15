import { config } from 'dotenv';
config();

console.log('--- DEBUG ENV ---');
console.log('POSTGRES_HOST:', process.env.POSTGRES_HOST);
console.log('POSTGRES_PORT:', process.env.POSTGRES_PORT);
console.log('POSTGRES_USER:', process.env.POSTGRES_USER);
console.log('--- END DEBUG ENV ---');
