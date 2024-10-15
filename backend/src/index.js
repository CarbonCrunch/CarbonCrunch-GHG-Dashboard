import dotenv from "dotenv";
import connectDB from "./db/index.js";
import {app} from "./app.js";
import router from "./routes/route.js";

const app = express();

app.use('/', router)

dotenv.config({
    path: "./.env.sample",
});

connectDB()
    .then(() => {
        app.listen(process.env.PORT || 8000, () => {
            console.log(`Server is running at port: ${process.env.PORT}`);
        });
    })
    .catch((err) => {
        console.log("Database Connection Failed! ", err);
    });
