module.exports = (router,controllers) => {
// notes
  router.get('/:folderId',controllers.getNotesByFolderId);
  router.put('/:folderId/:newtitle',controllers.addNoteTitle)
  router.post('/:noteId/title', controllers.renameNote); 
  router.post('/:noteId/content', controllers.editNoteContent);
  router.post('/:noteId/folderId', controllers.editNoteFolder);
  router.post('/:noteId/star', controllers.editNoteStar);
  router.get('/all/star', controllers.getNotesWithStar);
  router.delete('/:folderId/:noteId',controllers.deletNote)

  return router
}