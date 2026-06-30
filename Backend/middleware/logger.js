const logger = (req, res, next) => {
  const method = req.method;
  const route = req.url;
  
  const now = new Date();
  const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  console.log(`${method} ${route}`);
  console.log(`${time}`);
  
  next();
};

module.exports = logger;
