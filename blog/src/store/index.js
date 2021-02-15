import Vue from 'vue'
import Vuex from 'vuex'
import Titlelist from './Titlelist'
import folders from './modules/folders'
import notes from './modules/notes'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    editorDefault: '<p style="font-weight:bold;height:100%;display:flex;justify-content:center;align-items:center">无内容</p>',
    isShow_folders: true,
    folderid: '',
    titleid: '',
    content: '',
    contentTemp: '',
    titleidActive: 0
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    folders,
    notes,
    Titlelist
  }
})
