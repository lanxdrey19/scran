import expireOldSubmissions from "../usecases/expireOldSubmissions.js";
import IScranRepo from "../interfaces/IRepository.js"; 

function startSchedulers(scranRepo: IScranRepo): void {
  const cleanupCheckInterval = parseInt(process.env.SCRAN_CLEANUP_INTERVAL_MS ?? "86400000", 10);

  setInterval(() => {
    console.log("🔄 Running rating cleanup check...");
    expireOldSubmissions(scranRepo);
  }, cleanupCheckInterval);
}

export default startSchedulers;
