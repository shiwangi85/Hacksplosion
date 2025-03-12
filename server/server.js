
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PythonShell } from "python-shell";

dotenv.config();

const app = express();

const PORT = 5001;

app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" })); // Allow requests from your frontend origin

// Health check route
app.get("/", (req, res) => {
  res.send("Server is running! 🚀");
});

// let location = ;

// Route optimization using Google OR-Tools
app.post("/optimize-route", (req, res) => {
  // try {
    const { locations } = req.body;
    if (!locations || locations.length < 2) {
      return res.status(400).json({ error: "At least two locations required" });
    }

res.status(200).json({ message: "Optimization successful", data: locations });



    // // Run Python script for optimization
    // PythonShell.run(
    //   "optimizer.py",
    //   { 
    //     args: [JSON.stringify(locations)], 
    //     pythonPath: "python3",
    //     mode: "json" // This helps automatically parse the JSON response
    //   },
    //   (err, result) => {
    //     if (err) {
    //       console.error("Error in Python script:", err);
    //       return res.status(500).json({ error: "Optimization failed", details: err.message });
    //     }
    //     console.log("Python script output:", result);
    //     // Send the first result object (our script returns just one result)
    //     res.json(result[0]);
    //   }
    // );
  // } catch (error) {
  //   console.error("Error in optimization:", error);
  //   res.status(500).json({ error: "Failed to optimize route" });
  // }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});