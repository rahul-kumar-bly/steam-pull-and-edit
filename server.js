import app from "./index.js";

const port = process.env.PORT || 8080;

app.listen(port, ()=> {
    console.log(`App is listening at ${port}`);
});