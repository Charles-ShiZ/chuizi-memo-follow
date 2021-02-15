module.exports = (models) => {
  return {
    async getAllFolders (request,response) {
      console.log(12121)
      const res = await models.getAll('folders')
      response.send(res)
    },
    async addFolder (request,response) {
      const newName = request.params.newName
      const res = await models.searchByCond('folders','name', newName)
      if (!res.length) {
        const res = await models.addFolder(newName)
        response.send(res)
      } else {
        response.status(204).send('文件夹重复')
      }
    },
    async renameFolder (request,response) {
      request.on('data', async (buf) => {
        const id = parseInt(request.params.id)
        const { newName } = JSON.parse(buf.toString())
        if (!!id) {
          const res = await models.searchByCond('folders','name', newName)
          if (!res.length) {
            const res = await models.renameFolder(id, newName)
            response.send(res)
          } else {
            response.status(204).send('文件夹重复')
          }
        }
      })
    },
    async deleteFolder (request,response) {
      const id = request.params.id
      const res = await models.deleteFolder(id)
      response.send(JSON.stringify(res))
    }
  }
}
