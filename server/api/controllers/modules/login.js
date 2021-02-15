module.exports = (models) => {
  return {
    async login (request,response) {
      request.on('data', async (buf) => {
        const { username,password } = JSON.parse(buf.toString())
        console.log(username,password)
        const res = await models.searchByTwoConds('users', 'username', username, 'password', password)
        console.log(res.length)
        const hasUser = !!res.length
        response.send(hasUser)
      })
    }
  }
}
