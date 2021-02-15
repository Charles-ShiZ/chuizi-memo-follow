const notes = {
  namespaced: true,
  state: {
    notes: {},
    temp: { // 与数据库字段同步
      noteId: 0,
      noteIndex: -1,
      title: '',
      retitle: '',
      newtitle: '',
      folderId: 0,
      content: '',
      contentBackup: '',
      icon: ''
    }
  },
  mutations: {
    updateTemp (state, data) {
      for (const [key, value] of Object.entries(data)) {
        state.temp[key] = value
        // console.log(state.temp)
      }
    }
  },
  actions: {
  }
}
module.exports = notes
