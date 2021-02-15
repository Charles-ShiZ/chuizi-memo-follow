const folders = {
  namespaced: true,
  state: {
    folders: [],
    temp: { // 与数据库字段同步
      folderId: 0,
      folderIndex: 0,
      newfoldername: '',
      foldername: '',
      refoldername: '',
      icon: ''
    }
  },
  mutations: {
    setNotes (state, data) {
      state.notes[data.titleid - 1].content = data.content
    }
  },
  actions: {
  }
}
module.exports = folders
