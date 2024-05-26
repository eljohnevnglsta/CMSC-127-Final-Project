import express from "express";
import router from "./router.js";
import cors from "cors";

const PORT = 3001;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

router(app);
