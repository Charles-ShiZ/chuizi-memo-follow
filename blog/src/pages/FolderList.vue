<style lang="scss" scoped>
$theme-text-color:#635753;
$theme-bg-color:#D9D4CB;
.FolderList{
  height: 100%;
  .q-list{
    height: calc(100% - 100px);
    overflow:auto;
  }
}
.bg-theme{
   background-color: $theme-bg-color;
}
.bg-wood{
  background-color:#FBF7ED
}
.text-wood{
  color:#FBF7ED
}
.text-theme{
  color:$theme-text-color
}
.list-active{
  color: $theme-text-color;
  background-color: $theme-bg-color;
  box-shadow:inset 0 0 1px #9E9E9E
}
.q-item-div .q-item{
  padding:0px
}
.reflesh{
  position:fixed;
  bottom:50px;
  left:250px
}
.notesNum{
  width:30px;
  font-size: 16px;
  display:flex;
  align-items:center;
  justify-content:center;
}
.folderIcon{
  width:50px;
  font-size:24px;
  color:#616161;
  display:flex;
  align-items:center;
  justify-content:center;
}
.folderOpen{
  color:white;
}
#searchBox {
  box-shadow:inset 0 0 1px #9E9E9E;
  min-height:50px!important;
  .q-field{
    width:100%;
    .q-field--dense{
      height:30px!important
    }
  }
}
footer .q-icon {
  width:50px;height:50px;font-size:28px;display:flex;align-items:center
}
// .q-item-section{
//   transition: all 2s;
//   -moz-transition: all 2s; /* Firefox 4 */
//   -webkit-transition: all 2s; /* Safari 和 Chrome */
//   -o-transition: all 2s; /* Opera */
// }
</style>
<template>
<div class="FolderList">
  <q-toolbar id="searchBox" class="searchBox" >
    <q-input dark dense standout v-model="searchText">
      <template v-slot:append>
        <q-icon v-if="searchText === ''" name="search" color="theme" />
        <q-icon v-else name="clear" class="cursor-pointer" @click="searchText = ''" />
      </template>
    </q-input>
  </q-toolbar>
  <q-list folderId = "0" @contextmenu.prevent = "leftClick($event)" >
    <!-- 右键菜单 -->
    <div
      class="q-item-div"
      v-for="(item,index) in $store.state.folders.folders"
      :key="item.id"
      :folderId = "item.id"
      v-show="item.id!== 2"
    >
      <q-item
        :folderId = "item.id"
        clickable
        :active="$store.state.folders.temp.folderId === item.id"
        @click="clickFolder(item,index)"
        active-class="list-active"
      >
        <q-item-section v-show = "checkShow" style="padding:0" side>
          <q-checkbox v-model="check1" />
        </q-item-section>
        <section class="folderIcon" :folderId = "item.id">
          <q-icon :style="{color:item.iconColor}" :name="item.icon?item.icon:foldersTemp.folderId === item.id?'folder_open':'folder'" />
        </section>
        <q-item-section :folderId = "item.id"><span v-show="false">{{item.id}}</span>{{item.name}}</q-item-section>
        <section class="notesNum">
         {{item.notesNum}}
        </section>
      </q-item>
    </div>
      <!-- 右键菜单 -->
    <q-popup-proxy ref="leftMenus" context-menu>
      <q-list dense bordered>
        <q-item clickable v-ripple>
          <q-item-section value = "add">
            添加
            <q-popup-edit
              v-model = "$store.state.folders.temp.newfoldername"
              :cover="false"
              content-class="bg-white"
            >
              <q-input
                spellcheck="false"
                v-model = "$store.state.folders.temp.newfoldername"
                dense
                autofocus
                counter
                @keyup.enter.native = "addfolder"
              >
                <template v-slot:append>
                  <q-icon name="add" />
                </template>
                <template v-slot:after>
                  <q-btn
                    flat
                    dense
                    color="positive" icon="check_circle"
                    v-close-popup @keyup.enter = "addfolder"
                    @click.stop = "addfolder"
                    :disable = "$store.state.folders.temp.newfoldername === ''"
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
                v-model = "$store.state.folders.temp.refoldername"
                dense
                autofocus
                counter
                @keyup.enter.native = "renamefolder"
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
                    @click.stop = "renamefolder"
                    :disable = "$store.state.folders.temp.refoldername === $store.state.folders.temp.foldername"
                  />
                </template>
              </q-input>
            </q-popup-edit>
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple v-if="isMenuNeeded" >
          <q-item-section value = "del">
            删除
            <q-popup-proxy>
              <div style="display:flex;justify-content:center">
                <q-btn flat dense color="positive" icon="check_circle" @click.stop = "deletefolder()" v-close-popup />
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
  <footer>
    <q-btn flat>
      <q-icon name="select_all" @click="checkShow = !checkShow"></q-icon>
    </q-btn>
    <q-btn flat>
      <q-icon
        name="delete"
        @click="clickFolder($store.state.folders.folders[1],1)"
        style="color:red"
      >
      </q-icon>
    </q-btn>
  </footer>
</div>
</template>
<script>
export default {
  data () {
    return {
      checkShow: false,
      check1: '',
      searchText: '',
      qPopUpEditValue: '',
      leftMenus: [],
      isMenuNeeded: true
    }
  },
  computed: {
    foldersTemp () {
      return this.$store.state.folders.temp
    }
  },
  async mounted () {
    this.getfolders()
  },
  methods: {
    clickFolder (item, index) { // 已测试
      if (item.id !== this.$store.state.folders.temp.folderId) {
        this.$store.state.notes.temp.noteIndex = -1
        this.$store.state.notes.temp.noteId = 0
        this.$store.state.notes.temp.content = ''
        this.$store.state.notes.temp.contentBackup = ''
        document.getElementById('editor').children[0].innerHTML = this.$store.state.editorDefault
      }
      this.$store.state.folders.temp.folderId = item.id
      this.$store.state.folders.temp.folderIndex = index
      this.$store.state.folders.temp.foldername = item.name
      this.$store.state.folders.temp.refoldername = item.name
      // console.log(this.$store.state.folders.temp)
    },

    leftClick (evt, id) { // 已测试
      const folderId = parseInt(evt.target.attributes.folderId.value)
      const isFolder = folderId
      if (isFolder >= 3) {
        // 当右键点击到文件夹
        this.$store.state.folders.temp.folderId = folderId
        this.$store.state.folders.folders.filter((item, index) => {
          if (parseInt(item.id) === parseInt(folderId)) {
            this.$store.state.folders.temp.folderIndex = index
            this.$store.state.folders.temp.foldername = item.name
            this.$store.state.folders.temp.refoldername = item.name
          }
          // console.log(this.$store.state.folders.temp)
        })
        this.isMenuNeeded = true
      } else {
        console.log(this.$store.state.folders.temp)
        // 当右键点击到文件夹以外的区域
        this.isMenuNeeded = false
      }
    },
    leftHide () {
      this.$refs.leftMenus.hide()
    },
    async refreshforder () {
      this.getfolders()
      this.leftHide()
    },

    async getfolders () {
      const { data } = await this.$axios.get('/folders')
      this.$store.state.folders.folders = data
      this.clickFolder(data[2], 2)
    },

    async addfolder () { // 所需元素：新文件名 // 已测试
      const newfoldername = this.$store.state.folders.temp.newfoldername
      console.log(newfoldername)
      if (newfoldername) {
        const { status, data } = await this.$axios.put(`/folders/${newfoldername}`)
        if (status === 200) {
          const newFolder = {
            id: data.insertId,
            name: newfoldername,
            icon: ''
          }
          this.leftHide()
          this.$store.state.folders.folders.push(newFolder)
          this.$store.state.folders.temp.newfoldername = ''
        } else {
          this.$q.notify({
            message: '文件名重复',
            html: true,
            color: 'negative'
          })
        }
      }
    },

    async renamefolder () { // 所需元素：重命名的新文件名,文件夹id,文件夹索引 // 已测试
      const newName = this.$store.state.folders.temp.refoldername
      const folderId = this.$store.state.folders.temp.folderId
      const folderIndex = this.$store.state.folders.temp.folderIndex

      if (newName) {
        const { status } = await this.$axios.post(`/folders/${folderId}/name`, { newName: newName })
        if (status === 200) {
          this.leftHide()
          this.$store.state.folders.folders[folderIndex].name = newName
        } else {
          this.$q.notify({
            message: '文件名重复',
            html: true,
            color: 'negative'
          })
        }
      }
    },

    async deletefolder () { // 所需元素: 文件夹id,文件夹索引 // 已测试
      const folderId = this.$store.state.folders.temp.folderId
      const folderIndex = this.$store.state.folders.temp.folderIndex

      const res = await this.$axios.delete(`/folders/${folderId}`)
      if (res.status === 200) {
        this.leftHide()
        this.$store.state.folders.folders.splice(folderIndex, 1)
      }
    }
  }

}
</script>
