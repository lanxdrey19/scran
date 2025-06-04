import expireOldSubmissions from "../usecases/expireOldSubmissions.js";

function startSchedulers(scranRepo) {
  const cleanupCheckInterval =
    parseInt(process.env.SCRAN_CLEANUP_INTERVAL_MS, 10) || 30000;
  setInterval(() => {
    console.log("🔄 Running rating cleanup check...");
    expireOldSubmissions(scranRepo);
  }, cleanupCheckInterval);
}

export default startSchedulers;
