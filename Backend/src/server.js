require("dotenv").config();

const connectToDB = require("./config/database");
const app = require("./app");

const { generateInterviewReport } = require("./services/ai.service");

connectToDB();

// (async () => {
//   try {
//     const report = await generateInterviewReport(
//       resume,
//       selfDescription,
//       jobDescription,
//     );

//     console.log(JSON.stringify(report, null, 2));
//   } catch (error) {
//     console.error(error);
//   }
// })();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
