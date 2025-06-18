import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from '../app.module';
import { DataSource } from 'typeorm';

async function bootstrap() {
  const logger = new Logger('TestDBConnection');

  try {
    logger.log('Starting database connection test...');

    // Create a NestJS application
    const app = await NestFactory.createApplicationContext(AppModule);

    // Get the DataSource from the application
    const dataSource = app.get(DataSource);

    // Check if the connection is established
    if (dataSource.isInitialized) {
      logger.log('Database connection established successfully!');

      // Get database information
      const dbType = dataSource.options.type;
      const dbName = dataSource.options.database;
      const dbHost = (dataSource.options as any).host || 'localhost';
      const dbPort = (dataSource.options as any).port || 'default';

      logger.log(`Connected to ${dbType} database "${dbName}" on ${dbHost}:${dbPort}`);

      // Test a simple query
      const result = await dataSource.query('SELECT NOW()');
      logger.log(`Current database time: ${result[0].now}`);
    } else {
      logger.error('Database connection failed!');
    }

    // Close the application
    await app.close();
    logger.log('Test completed');
  } catch (error) {
    logger.error('Error during database connection test:', error);
    process.exit(1);
  }
}

bootstrap();
