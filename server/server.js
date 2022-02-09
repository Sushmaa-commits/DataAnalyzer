const express = require("express");
const app = express();
const port = 4444;

app.use(express.static("public"));

app.listen(port, () => {
  console.log(`Static server is running on port ${port}`);
});
