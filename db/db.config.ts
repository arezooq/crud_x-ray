import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { DataEntity } from 'src/data/entities/data.entity';

config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'mongodb',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [DataEntity],
  logging: false,
  synchronize: false,
};

const dataSource = new DataSource(dataSourceOptions);
dataSource.initialize()
  .then(() => console.log('Data Source has been initialized!'))
  .catch((error) => console.log('Error during Data Source initialization:', error));

export default dataSource;
