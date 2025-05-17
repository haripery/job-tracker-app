import app from './app';
import { sequelize } from './models';

const port = process.env.PORT || 3001;

(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    app.listen(port, () => {
      console.log(`REST API listening on ${port}`);
    });
  } catch (err) {
    console.error('Unable to connect to the database:', err);
  }
})();
