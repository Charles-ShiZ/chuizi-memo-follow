module.exports = (router,controllers) => {
// folders
  router.get('/', controllers.getAllFolders)

  router.put('/:newName', controllers.addFolder)

  router.post('/:id/name', controllers.renameFolder),

  router.delete('/:id', controllers.deleteFolder);  

  return router
}