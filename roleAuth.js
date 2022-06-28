//No one can acess the data other than themselves
function authRole(role) {
  return (req, res, next) => {
    if (req.user.role !== role) {
      res.status(401)
      return res.send("You've no permissions")
    }
    next()
  }
}
//check for authentication
function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
      return next()
  }
  res.redirect('/login')
}
function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
      return res.redirect('/')
  }
  next()
}

module.exports = { authRole, checkAuthenticated , checkNotAuthenticated} 