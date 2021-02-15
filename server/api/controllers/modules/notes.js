module.exports = (models) => {
  return {
    async getNotesByFolderId (request,response) {
      const folderId = request.params.folderId
      const res = await models.searchByCond('notes','folderId', folderId)
      response.send(res)
    },
    async addNoteTitle (request,response) {
      const folderId = request.params.folderId
      const newtitle = request.params.newtitle
  
      const res = await models.searchByCond('notes','title', newtitle)
      if (!res.length) {
        const res = await models.addNoteTitle(folderId, newtitle)
        response.send(res)
      } else {
        response.status(204).send('笔记名重复')
      }
    },
    async renameNote (request,response) {
      const noteId = parseInt(request.params.noteId)
      const { folderId, newtitle } = JSON.parse(buf.toString())
      if(!!noteId){
        const res = await models.searchByCond('notes','title', newtitle)
        if (!res.length) {
          const res = await models.updateNote( {folderId: folderId, id: noteId}, {title: newtitle} )
          response.send(res)
        } else {
          response.status(204).send('笔记标题重复')
        }
      }
    },
    async editNoteContent (request,response) {
      request.on('data',async (buf) =>{
        const noteId = parseInt(request.params.noteId)
        const { folderId,content } = JSON.parse(buf.toString())
        const content_r = content.replace(/"([^"]*)"/g, "'$1'")
        const res = await models.updateNote( {folderId: folderId, id: noteId}, {content: content_r} )
        response.send(res)
      })
    },
    async editNoteFolder (request,response) {
      request.on('data',async (buf) =>{
        const noteId = parseInt(request.params.noteId)
        const { folderId_origin,folderId_new } = JSON.parse(buf.toString())
        const res = await models.updateNote( {folderId: folderId_origin, id: noteId}, {folderId: folderId_new} )
        response.send(res)
      })
    },
    async editNoteStar (request,response) {
      request.on('data',async (buf) =>{
        const noteId = parseInt(request.params.noteId)
        const { star, folderId } = JSON.parse(buf.toString())
        console.log({noteId, star, folderId })
        const res = await models.updateNote( {folderId: folderId, id: noteId}, {star: star} )
        if (star) {
          models.queryPromise(`UPDATE folders SET notesNum=notesNum+1 WHERE BINARY id=1`)
        } else {
          models.queryPromise(`UPDATE folders SET notesNum=notesNum-1 WHERE BINARY id=1`);
        }
        response.send(res)
      })
    },
    async getNotesWithStar (request,response) {
      const res = await models.searchByCond('notes', 'star', 1)
      response.send(JSON.stringify(res))
    },
    async deletNote (request,response) {
      const folderId = request.params.folderId
      const noteId = request.params.noteId
      const res = await models.deleteNote(folderId, noteId)
      response.status(200).send(res)
    },
  }
  
}