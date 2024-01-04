import express, { Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import { connectDatabase } from './configurations/database';
import { notFound } from './middlewares/404-handler';
import { errorHandler } from './middlewares/error-handler';
import userRoutes from './routes/user.routes';
import productRoutes from './routes/product.routes';
import orderRoutes from './routes/order.routes';

connectDatabase();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// This middleware is run when request is not handled by a route.
app.use(notFound);

// This middleware is run when an error is thrown in the application
app.use(errorHandler);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
