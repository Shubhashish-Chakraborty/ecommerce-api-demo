import express from 'express';
import mongoose from 'mongoose';
import { MONGO_URL, PORT } from './config';

import { ProductRouter } from './routes/ProductRoutes';
import { UserRouter } from './routes/UserRoutes';

const app = express();

app.use(express.json()); // Parse JSON bodies

app.use("/api/products" , ProductRouter)
app.use("/api/auth/user" , UserRouter)

app.get('/' , (req , res) => {
    res.send("Ecommerce API is UP!!")
})

async function main() {
    mongoose.connect(MONGO_URL, {
    }).then(() => {
        console.log('Connection Successfully Established to the ECommerce Database!!');
        app.listen(PORT, () => {
            console.log(`ECommerce Backend Hosted on: http://localhost:${PORT}`)
        });
    }).catch((err) => {
        console.error(err);
    });
}
main();