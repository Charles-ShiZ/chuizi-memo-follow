<style lang="scss" scoped>
$theme-text-color:#635753;
.q-list{
  height: calc(100% - 50px);
  overflow:auto;
}
.q-list--bordered{
  border:0
}
.list-active{
  color: $theme-text-color;
  background-color: #D9D4CB;
  box-shadow:inset 0 0 1px #9E9E9E
}
.q-item__label{
  white-space: nowrap;
  text-overflow: ellipsis;
  display: inline-block;
  word-break:break-all
}
.noneNotes{
  height:100%;
  display:flex;
  justify-content: center;
  align-items:center;
  font-size: 1.1rem;
  font-weight: bold;
}
.timeCreated{
  font-size:0.8rem;
  color:rgb(129, 129, 129)
}
.q-menu{
  overflow: scroll;
}
</style>
<template>
  <div style = "height:100%">
    <q-list class="TitleList" titleid = "0" bordered separator @contextmenu.prevent.self = "leftClick({id:0})">
      <div v-if="!notes.length" class="noneNotes">没有任何便签</div>
      <main v-else>
        <div class="q-item-div" v-for="(item,index) in notes" :key="item.id" :titleid = "item.id">
          <q-item
            @contextmenu.prevent = "leftClick(item,index)"
            clickable
            :active="$store.state.notes.temp.noteIndex === index"
            @click = "clickNoteTitle($event,item,index)"
            active-class="list-active"
          >
            <q-item-section>
              <q-item-label class="timeCreated">{{item.createTime}}</q-item-label>
              <q-item-label>{{item.title}}</q-item-label>
            </q-item-section>
            <q-item-section avatar>
              <q-icon name="star" :style="{color:item.star?'orange':''}"/>
            </q-item-section>
          </q-item>
        </div>
      </main>
      <!-- 右键菜单 -->
      <q-popup-proxy ref="leftMenus" context-menu>
        <q-list dense bordered>
          <q-item clickable v-ripple>
            <q-item-section value = "add">
              添加
              <q-popup-edit
                v-model = "$store.state.notes.temp.newtitle"
                :cover="false"
                content-class="bg-white"
              >
                <q-input spellcheck="false" v-model = "$store.state.notes.temp.newtitle" dense autofocus counter>
                  <template v-slot:append>
                    <q-icon name="add" />
                  </template>
                  <template v-slot:after>
                    <q-btn
                      flat
                      dense
                      color="positive" icon="check_circle"
                      v-close-popup @keyup.enter = "addNoteTitle"
                      @click.stop = "addNoteTitle"
                      :disable = "$store.state.notes.temp.newtitle === ''"
                    />
                  </template>
                </q-input>
              </q-popup-edit>
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple v-if="isMenuNeeded" >
            <q-item-section value = "rename">
              重命名
              <q-popup-edit
                v-model = "qPopUpEditValue"
                :cover="false"
                content-class="bg-white"
              >
                <q-input
                  spellcheck="false"
                  v-model = "$store.state.notes.temp.retitle"
                  dense
                  autofocus
                  counter
                  @keyup.enter.native = "reNoteTitle"
                >
                  <template v-slot:append>
                    <q-icon name="edit" />
                  </template>
                  <template v-slot:after>
                    <q-btn
                      flat
                      dense
                      color="positive"
                      icon="check_circle"
                      v-close-popup
                      @click.stop = "reNoteTitle"
                      :disable = "$store.state.notes.temp.retitle === $store.state.notes.temp.title"
                    />
                  </template>
                </q-input>
              </q-popup-edit>
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple v-if="isMenuNeeded">
            <div style="width:135px;display:flex;justify-content:space-between">
              <q-item-section value = "refresh" @click.stop = "refreshNotes()">
                移动
              </q-item-section>
              <q-item-section side style="padding-left:0">
                <q-icon name="keyboard_arrow_right" />
              </q-item-section>
            </div>
            <q-menu anchor="top right" self="top left">
              <q-list @click = "moveToOtherFolder($event)">
                <q-item
                  v-for="(item,index) in $store.state.folders.folders"
                  :key="index"
                  v-show = "item.id >= 3 && item.id !== $store.state.notes.temp.folderId "
                  dense
                  clickable
                >
                  <q-item-section :folderId = "item.id">{{item.name}}</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-item>

          <q-item clickable v-ripple v-if="isMenuNeeded" >
            <q-item-section value = "del">
              删除
              <q-popup-proxy>
                <div style="display:flex;justify-content:center">
                  <q-btn flat dense color="positive" icon="check_circle" @click.stop = "deleteNoteTitle()" v-close-popup />
                  <q-btn flat dense color="negative" icon="cancel" v-close-popup />
                </div>
              </q-popup-proxy>
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple>
            <q-item-section value = "refresh" @click.stop = "refreshNotes()">
              刷新
            </q-item-section>
          </q-item>
        </q-list>
      </q-popup-proxy>
    </q-list>
  <footer style="display:flex;justify-content:space-between;padding:0 10px">
    <q-icon style="color:green;width:50px;height:50px;font-size:25px;display:flex;align-items:center" name="android"></q-icon>
  </footer>
  </div>
</template>

<script>
export default {
  data () {
    return {
      notes: [],
      qPopUpEditValue: '',
      newTitleRegister: '',
      retitleRegister: '',
      titleIdRegister: '',
      isMenuNeeded: ''
    }
  },

  computed: {
    foldersState () {
      return this.$store.state.folders
    },
    notesState () {
      return this.$store.state.notes
    }
  },

  watch: {
    async '$store.state.folders.temp.folderId' (val) {
      if (val === 1) {
        this.getNotesWithStar()
      } else {
        this.getNotes()
      }
    }
  },
  methods: {
    async clickNoteTitle (evt, item, index) {
      // 如果evt是null,则证明是来自点击文件夹而产生的自动点击标题
      if (evt && evt.target.innerText === 'star') {
        this.toggleStar(item, index)
        return
      }
      this.$store.commit('notes/updateTemp', {
        noteId: item.id, // 笔记ID
        noteIndex: index, // 笔记在数组中的索引
        title: item.title, // 笔记标题
        retitle: item.title,
        folderId: item.folderId, // 笔记所在文件夹ID
        content: item.content, // 笔记内容
        contentBackup: item.content // 笔记内容备份
      })
      document.getElementById('editor').children[0].innerHTML = unescape(item.content)
    },
    leftClick (item, index) {
      const isNoteTitle = !!item.id
      if (isNoteTitle) {
        this.$store.commit('notes/updateTemp', {
          noteId: item.id, // 笔记ID
          noteIndex: index, // 笔记在数组中的索引
          title: item.title, // 笔记标题
          retitle: item.title,
          folderId: item.folderId, // 笔记所在文件夹ID
          content: item.content, // 笔记内容
          contentBackup: item.content // 笔记内容备份
        })
        this.isMenuNeeded = true
      } else {
        this.isMenuNeeded = false
      }
    },
    async toggleStar (item, index) {
      const { folderId, id: noteId } = item
      const currentFolderId = this.foldersState.temp.folderId // 当前所进入的文件夹id
      const star = Number(!this.notesState.notes[currentFolderId][index].star)

      await this.$axios.post(`/notes/${noteId}/star`, { star, folderId })
      this.notesState.notes[currentFolderId][index].star = star
      const starFolder = this.foldersState.folders[0]
      star ? starFolder.notesNum++ : starFolder.notesNum--
    },
    async refreshNotes () {
      this.getNotes()
      this.$refs.leftMenus.hide()
    },
    firstAutoClick () {
      if (this.notes.length > 0) {
        this.clickNoteTitle(null, this.notes[0], 0)
      }
    },
    async getNotes () {
      const folderId = this.foldersState.temp.folderId
      if (!this.notesState.notes[folderId]) {
        const { data } = await this.$axios.get(`/notes/${folderId}`)
        this.notesState.notes[folderId] = data
        this.notes = data
      } else {
        this.notes = this.notesState.notes[folderId]
      }
      // this.firstAutoClick()
    },
    async getNotesWithStar () {
      const starFolderId = 1
      const { data } = await this.$axios.get('/notes/all/star')
      this.notesState.notes[starFolderId] = data
      this.notes = data
      // this.firstAutoClick()
    },
    async addNoteTitle () { // 已测试
      const folderId = this.foldersState.temp.folderId
      const newtitle = this.notesState.temp.newtitle
      const folderIndex = this.foldersState.temp.folderIndex

      if (newtitle) {
        const { status, data } = await this.$axios.put(`/notes/${folderId}/${newtitle}`)
        if (status === 200) {
          const newNote = {
            id: data.insertId,
            title: newtitle,
            icon: '',
            folderId: folderId,
            content: ''
          }
          this.foldersState.folders[folderIndex].notesNum++
          this.notesState.notes[folderId].push(newNote)
          this.notesState.temp.newtitle = ''
        } else {
          this.$q.notify({
            message: '笔记标题重复',
            html: true,
            color: 'negative'
          })
        }
      }
    },
    async reNoteTitle () { // 已测试
      const folderId = this.notesState.temp.folderId
      const noteId = this.notesState.temp.noteId
      const retitle = this.notesState.temp.retitle
      const noteIndex = this.notesState.temp.noteIndex
      // console.log(folderId, noteId, noteIndex, retitle)
      if (retitle) {
        const { status } = await this.$axios.post(`/notes/${noteId}/title`, { folderId: folderId, newtitle: retitle })
        if (status === 200) {
          this.notesState.notes[folderId][noteIndex].title = retitle
          this.$refs.leftMenus.hide()
        }
      } else {
        this.$q.notify({
          message: '笔记名不能未空',
          html: true,
          color: 'negative'
        })
      }
    },
    async moveToOtherFolder (evt, toWhich) {
      let newFolderId = 0
      const trashFolder = 2
      if (evt) {
        newFolderId = parseInt(evt.target.attributes.folderId.value)
      } else {
        newFolderId = toWhich
      }
      const oldFolderId = parseInt(this.notesState.temp.folderId)
      const noteIndex = parseInt(this.notesState.temp.noteIndex)
      const noteId = parseInt(this.notesState.temp.noteId)
      const folderIndex = parseInt(this.foldersState.temp.folderIndex)

      const { status } = await this.$axios.post(`/notes/${noteId}/folderId`, {
        folderId_origin: oldFolderId,
        folderId_new: newFolderId
      })
      if (status === 200) {
        const noteBeMoved = this.notesState.notes[oldFolderId].splice(noteIndex, 1)[0]
        if (this.notesState.notes[newFolderId]) {
          this.notesState.notes[newFolderId].push(noteBeMoved)
        }
        this.foldersState.folders[trashFolder - 1].notesNum++
        this.foldersState.folders[folderIndex].notesNum--
        this.$refs.leftMenus.hide()
      } else {
        this.$q.notify({
          message: '移动失败',
          html: true,
          color: 'negative'
        })
      }
    },
    async deleteNoteTitle () {
      const folderId = this.foldersState.temp.folderId
      const noteId = this.notesState.temp.noteId
      const folderIndex = this.foldersState.temp.folderIndex
      const noteIndex = this.notesState.temp.noteIndex

      if (folderId === 2) { // 回收站的文件夹编号是2
        const res = await this.$axios.delete(`/notes/${folderId}/${noteId}`)
        this.foldersState.folders[folderIndex].notesNum--
        this.$refs.leftMenus.hide()
        console.log('after delete', res)
        this.notesState.notes[folderId].splice(noteIndex, 1)
      } else {
        this.moveToOtherFolder(null, 2)
      }
    }
  }
}
</script>
