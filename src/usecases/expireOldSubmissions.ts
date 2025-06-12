import IRepository from "../interfaces/IRepository.js";
import ScranSubmission from "../domain/ScranSubmission.js";

function expireOldSubmissions(scranRepo: IRepository): void {
  const allSubmissions: ScranSubmission[] = scranRepo.getAll();
  const expiredSubmissions = allSubmissions.filter((sub) => sub.isExpired());

  if (expiredSubmissions.length > 0) {
    console.log("🗑 Expiring the following submissions:");
    expiredSubmissions.forEach((sub) => {
      console.log(`- Message ID: ${sub.destMsg.id}`);
    });
  }

  scranRepo.deleteAll((sub) => sub.isExpired());
}

export default expireOldSubmissions;
