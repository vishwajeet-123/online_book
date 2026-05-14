import { seedDatabase } from "./seed.ts";

console.log("Starting manual seed...");
seedDatabase()
  .then(() => console.log("Manual seed finished successfully."))
  .catch(err => console.error("Manual seed failed:", err));
