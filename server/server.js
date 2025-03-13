
// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import { PythonShell } from "python-shell";

// dotenv.config();

// const app = express();

// const PORT = 5001;

// app.use(express.json());
// app.use(cors({ origin: "http://localhost:5173" })); // Allow requests from your frontend origin

// // Health check route
// app.get("/", (req, res) => {
//   res.send("Server is running! 🚀");
// });

// // let location = ;

// // Route optimization using Google OR-Tools
// app.post("/optimize-route", (req, res) => {
//   // try {
//     const { locations } = req.body;
//     if (!locations || locations.length < 2) {
//       return res.status(400).json({ error: "At least two locations required" });
//     }

// res.status(200).json({ message: "Optimization successful", data: locations });



// });

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import fs from "fs";
// import path from "path";
// import { fileURLToPath } from "url";
// import csv from "csv-parser";

// dotenv.config();

// const app = express();
// const PORT = 5001;

// app.use(express.json());
// app.use(cors({ origin: "http://localhost:5173" })); // Allow requests from frontend

// // Define __dirname in ES Module scope
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Resolve the correct CSV file path
// const csvFilePath = path.join(__dirname,"..", "public", "deliveries.csv");

// // Function to read CSV and convert to JSON
// const readCSV = (filePath) => {
//   return new Promise((resolve, reject) => {
//     const results = [];
//     fs.createReadStream(filePath)
//       .pipe(csv())
//       .on("data", (data) => results.push(data))
//       .on("end", () => resolve(results))
//       .on("error", (error) => reject(error));
//   });
// };

// // API to fetch CSV data
// app.get("/api/deliveries", async (req, res) => {
//   try {
//     if (!fs.existsSync(csvFilePath)) {
//       return res.status(404).json({ error: "CSV file not found" });
//     }

//     const data = await readCSV(csvFilePath);
//     res.json(data);
//   } catch (error) {
//     res.status(500).json({ error: "Error reading CSV file" });
//   }
// });

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });



// import express from "express";
// import cors from "cors";
// import fs from "fs";
// import path from "path";
// import { fileURLToPath } from "url";
// import csv from "csv-parser";

// const app = express();
// const PORT = 5001;

// // Define __dirname in ES Module scope
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Path to CSV file (inside 'public' folder)
// const csvFilePath = path.join(__dirname, "..","public", "deliveries.csv");

// // Allow frontend to access server
// app.use(cors({ origin: "http://localhost:5173" })); 

// // Function to read CSV and convert to JSON
// const readCSV = () => {
//   return new Promise((resolve, reject) => {
//     const results = [];
//     fs.createReadStream(csvFilePath)
//       .pipe(csv())
//       .on("data", (data) => {
//         // Convert coordinates to an array
//         if (data.coordinates) {
//           const [lat, lng] = data.coordinates.split(",").map(Number);
//           data.coordinates = [lat, lng]; // Convert to array
//         }

//         // Convert items from string to array (if needed)
//         if (data.items) {
//           data.items = data.items.split(";").map((item) => item.trim());
//         }

//         results.push(data);
//       })
//       .on("end", () => resolve(results))
//       .on("error", (error) => reject(error));
//   });
// };


// // Route to get CSV data
// app.get("/deliveries", async (req, res) => {
//   try {
//     if (!fs.existsSync(csvFilePath)) {
//       return res.status(404).json({ error: "CSV file not found" });
//     }

//     const data = await readCSV();
//     res.json(data);
//   } catch (error) {
//     res.status(500).json({ error: "Error reading CSV file" });
//   }
// });



// // Start server
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });








import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import csv from "csv-parser";
import fetch from "node-fetch"; // Import fetch for backend requests

const app = express();
const PORT = 5002;

// Define __dirname in ES Module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to CSV file (inside 'public' folder)
// const csvFilePath = path.join(__dirname, "..", "public", "deliveries.csv");
const csvFilePath = path.join(__dirname, "..","public", "deliveries.csv");
// Allow frontend to access server
app.use(cors({ origin: "http://localhost:5173" }));

// Function to read CSV and convert to JSON
const readCSV = () => {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on("data", (data) => {
        if (data.coordinates) {
          const [lat, lng] = data.coordinates.split(",").map(Number);
          data.coordinates = [lat, lng];
        }
        if (data.items) {
          data.items = data.items.split(";").map((item) => item.trim());
        }
        results.push(data);
      })
      .on("end", () => resolve(results))
      .on("error", (error) => reject(error));
  });
};

// Route to get CSV data
app.get("/deliveries", async (req, res) => {
  try {
    if (!fs.existsSync(csvFilePath)) {
      return res.status(404).json({ error: "CSV file not found" });
    }
    const data = await readCSV();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Error reading CSV file" });
  }
});

// ✅ New Route: Proxy Request to Mappls API
app.get("/optimize-route", async (req, res) => {
  try {
    const apiKey = "21aec3f8c1f1cf282554c5d96095864e"; // Replace with your actual API key
    const { source, destination, waypoints } = req.query;

    const url = `https://apis.mappls.com/advancedmaps/v1/${apiKey}/route_optimize?source=${source}&destination=${destination}&waypoints=${waypoints}`;

    const response = await fetch(url, { method: "GET" });

    if (!response.ok) {
      return res.status(response.status).json({ error: "Failed to fetch optimized route" });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching optimized route:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});









// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
