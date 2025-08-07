import expireOldSubmissions from "../usecases/expireOldSubmissions.js";
import IScranRepo from "../interfaces/IRepository.js"; 
import logger from "../logger.js";

function startSchedulers(scranRepo: IScranRepo): void {
  const cleanupCheckInterval = parseInt(process.env.SCRAN_CLEANUP_INTERVAL_MS ?? "86400000", 10);

  setInterval(() => {
    logger.debug("🔄 Running rating cleanup check...");
    expireOldSubmissions(scranRepo);
  }, cleanupCheckInterval);
}

export default startSchedulers;
