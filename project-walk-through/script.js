// REQUIRES A SERVER TO BYPASS CORS ISSUE
const draw = async () => {
  const dataset = await d3.csv("dataset.csv");
  console.log(dataset);
};

draw();
