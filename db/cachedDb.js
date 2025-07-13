const redis = require('redis');

async function connectRedis(options = {}) {
  const config = {
    url: options.url || process.env.REDIS_DEP || 'redis://localhost:6379',
    ...options.clientOptions
  };

  const redisClient = redis.createClient(config);

  redisClient.on('error', (err) => {
    console.error('Redis Client Error:', err);
  });

  redisClient.on('connect', () => {
    console.log('Connected to Redis');
  });

  // Connect to Redis
  await redisClient.connect();
  
  return redisClient;
}

module.exports ={connectRedis}