import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import mongoose from "mongoose"
import userRouter from "./routes/userRoutes.js";
import uploadRouter from "./routes/uploadRouter.js";
import noticeRouter from "./routes/noticeRoutes.js";
import folderRouter from "./routes/folderRoutes.js";
import taskRouter from "./routes/taskRoutes.js";
import searchRouter from "./routes/searchRoute.js";
import fileRouter from "./routes/fileRoutes.js";

dotenv.config();
mongoose.connect(process.env.MONGODB_URL)
    .then(() => console.log('Connected to db'))
    .catch((err) => console.log(err.message))

const app = express();
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.use("/api/users", userRouter)

app.use('/api/upload', uploadRouter)

app.use("/api/notices", noticeRouter)

app.use("/api/folders", folderRouter)

app.use("/api/tasks", taskRouter)

app.use("/api/search", searchRouter)

app.use("/api/files", fileRouter)

const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`Server ok on ${port}`)
})