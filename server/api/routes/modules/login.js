module.exports = (router,controllers) => {
  router.post("/", controllers.login)

  return router
}
