const app = require('./src/app');
const { PORT } = require('./src/config');

app.listen(PORT, () => {
  console.log(`Task Manager API running on http://localhost:${PORT}`);
});
