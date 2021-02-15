const titlelist = {
  namespaced: true,
  state: {
    notes: []
  },
  mutations: {
    setNotes (state, data) {
      state.notes[data.titleid - 1].content = data.content
    }
  },
  actions: {
  }
}
module.exports = titlelist
