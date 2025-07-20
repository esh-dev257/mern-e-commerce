
const adminEmail = "eshitabhawsar@gmail.com";

function isAdmin(req, res, next) {
  const email =
    req.user?.email || (req.user?.emails && req.user.emails[0]?.value);

  if (!email) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  if (email !== adminEmail) {
    return res.status(403).json({ error: "Access denied: Not an admin" });
  }
  next();
}

module.exports = isAdmin;
