
import { NestFactory } from '@nestjs/core';
import * as express from 'express';
import { Request, Response } from 'express';
import { existsSync, mkdirSync } from 'fs';
import * as path from 'path';
import { AppModule } from './app.module';
let cors = require('cors')
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cors())
  app.use(cors({
    origin: 'http://localhost:3000', // Replace with your frontend's URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
  }));
  const uploadsDirectory = path.join('./uploads');
  // Serve uploaded files from the '/uploads' route
  app.use('/uploads', express.static(uploadsDirectory));
  app.use(express.static(path.join(__dirname, '../src', 'dist')));

  app.use(['/dashboard', '/login', '/general-settings', '/create-email', '/create-list', '/email-template', '/preferences*', '/manage-list'], (req: Request, res: Response) => {
    try {
      res.sendFile(path.join(__dirname, '../src', 'dist', 'index.html'));
    } catch (error) {
      res.status(500).send('An error occurred');
    }
  });

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  const uploadsPath = path.join(__dirname, '../uploads');

  if (!existsSync(uploadsPath)) {
    mkdirSync(uploadsPath);
  }


  await app.listen(8000);
}
bootstrap();
