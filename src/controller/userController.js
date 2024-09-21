const router = require("express").Router();
const  userService  = require("../services/userService");
const { getErrorMessage } = require("../utils/errorHelpers");
const { isLogged, isAuth } = require('../middlewares/authMiddleware')

router.get("/login", isLogged, (req, res) => {
  res.render("users/login");
});

router.post('/login', isLogged, async (req, res) => {
    const { email, password} = req.body

    try{
        const token = await userService.login(email, password)

        res.cookie('token', token)

        res.redirect('/')
    }catch(err){
        res.render('users/login', {error: getErrorMessage(err), email})
    }
})

router.get("/register", isLogged, (req, res) => {
  res.render("users/register");
});

router.post("/register", isLogged, async (req, res) => {
  const userData = req.body;

  try{
      const token = await userService.register(userData);

      res.cookie('token', token)

      res.redirect('/')
  }catch(err){
    res.render('users/register', {error: getErrorMessage(err), userData})
  }
});

router.get('/logout', isAuth, (req, res) => {
    res.clearCookie('token')
    
    res.redirect('/')
})

module.exports = router;
