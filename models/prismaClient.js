const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
    log: [
      { level: 'query', emit: 'event' }, // Log queries
      { level: 'info', emit: 'event' },  // Log info messages
      { level: 'warn', emit: 'event' },  // Log warnings
      { level: 'error', emit: 'event' }, // Log errors
    ],
  });
  prisma.$on('query', (e) => {
    console.log('++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++'  );
    console.log('Query: ' + e.query);
    console.log('Params: ' + e.params);
    console.log('Duration: ' + e.duration + 'ms');
    console.log('++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++'  );
  });
module.exports = prisma;
