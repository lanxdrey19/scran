function expireOldSubmissions(scranRepo) {
  const allSubmissions = scranRepo.getAll();
  const expiredSubmissions = allSubmissions.filter((sub) => sub.isExpired());

  if (expiredSubmissions.length > 0) {
    console.log("🗑 Expiring the following submissions:");
    expiredSubmissions.forEach((sub) => {
      console.log(`- Message ID: ${sub.destMsg.id}`);
    });
  }

  scranRepo.deleteAll((sub) => sub.isExpired());
}

module.exports = expireOldSubmissions;
