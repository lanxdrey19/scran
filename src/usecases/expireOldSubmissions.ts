import IRepository from "../interfaces/IRepository.js";
import ScranSubmission from "../domain/ScranSubmission.js";
import logger from "../logger.js";

function expireOldSubmissions(scranRepo: IRepository): void {
  const allSubmissions: ScranSubmission[] = scranRepo.getAll();
  const expiredSubmissions = allSubmissions.filter((sub) => sub.isExpired());

  if (expiredSubmissions.length > 0) {
    logger.debug("🗑 Expiring the following submissions:");
    expiredSubmissions.forEach((sub) => {
      logger.debug(`- Message ID: ${sub.destMsg.id}`);
    });
  }

  scranRepo.deleteAll((sub) => sub.isExpired());
}

export default expireOldSubmissions;
