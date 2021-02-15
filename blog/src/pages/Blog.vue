<style lang="scss">
$theme-color: #109e46;
$theme-text-color:#635753;
*{
  font-size:14px;
    // font-weight: bold;
}
html,body,.q-layout,.q-page-container,.scroll{
  height:100%!important;
  overflow: hidden;
  font-family: microsoft yahei;
  color: $theme-text-color;
}
::-webkit-scrollbar{
  width: 10px;
  height: 10px;
}
::-webkit-scrollbar-thumb{
  background-color: #b5d1be;
  border: 3px solid transparent;
  background-clip: padding-box;
}
::-webkit-scrollbar-thumb:hover{
  background-color: #7cca95;
}
::-webkit-scrollbar-track-piece {
  background: 0 0;
}
.q-layout-container{
  border-radius: 0%!important;
}
.q-page-container{
  display: flex;
}
.q-page-container>div{
  height: 100%
}
.q-layout-container > div > div{
  height: 100%;
}
.q-menu{
  height:auto!important;
  min-width: 150px;
  // max-height: 200px;
}
.q-field__control{/*添加文件夹名时的底部动态横线*/
  color:$theme-color!important
}
.q-drawer .overflow-auto{
  overflow: hidden!important;
}
.q-popup-edit{
  min-width: 360px!important;
}
.q-item-div{
  border-bottom: 1px #e4dad1 solid;
  .q-item{
    height: 50px;
  }
}
.q-menu .q-item{
  padding:0px!important;
  text-indent: 1em;
  box-sizing: border-box;
}
footer{
  height:50px;
  border-top: 1px solid #cacbcc;
  background: linear-gradient(#f2f2f3,#eceded);
  box-shadow: 0 -1px 6px rgba(0,0,0,.03);
  z-index: 2;
  overflow: hidden;
  display:flex;
  justify-content:space-between;
}
footer .q-btn__wrapper{
  padding:0!important
}
</style>

<style lang="scss" scoped>
.q-toolbar__title{
  font-size:20px!important
}
.q-list{
  overflow-x:hidden
}
.q-item.q-router-link--active, .q-item--active {
  color: #009688!important;
}
.bg-mycolor{
  background-color:#171f26!important;
}
.bg-wood{
  background-color:#FBF7ED
}
.q-toolbar section{
  height: 50px!important;
}
.saveBtn {
  width:80px;
  height: 40px;
  .q-btn__content{
    width:80px;
    height: 20px;
  }
}
</style>

<template>
  <q-layout view="hHh Lpr lff" container class="shadow-2 rounded-borders">
    <q-header elevated class="bg-mycolor">
      <q-toolbar>
        <q-btn flat @click="drawer = !drawer" round dense icon="menu" />
        <q-toolbar-title>便签</q-toolbar-title>
        <q-btn-toggle
          style="margin-right:10px"
          v-model="model"
          push
          glossy
          toggle-color="primary"
          :options="[
            {label: '白', value: 'white'},
            {label: '暗', value: 'dark'},
            {label: '木', value: 'wood'}
          ]"
        />
        <q-btn @click="saveContent" glossy icon="save" />
        <!-- <q-btn
          push
          glossy
          unelevated
          color="orangered"
          text-color="white"
          @click="saveContent"
          icon="save"
        /> -->
        <!-- <q-btn class="saveBtn" size="md" color="red" >保存</q-btn> -->
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="drawer"
      show-if-above
      :mini="miniState"
      @mouseover="miniState = false"
      @mouseout="miniState = true"
      mini-to-overlay

      :width="200"
      :breakpoint="500"
      bordered
      content-class="bg-grey-3"
    >
      <q-scroll-area class="fit">
        <q-list padding>
          <q-item clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="inbox" />
            </q-item-section>

            <q-item-section>
              进击的巨人
            </q-item-section>
          </q-item>

          <q-item active clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="star" />
            </q-item-section>

            <q-item-section>
              这是星星
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple>
            <q-item-section avatar>
              <!-- <q-spinner-cube color="orange" size="24px"/> -->
            </q-item-section>

            <q-item-section>
              邮件
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="drafts" />
            </q-item-section>

            <q-item-section>
              其他
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <section v-show="$store.state.isShow_folders" style="min-width:250px!important;height:100%;border-right:1px solid #ddd" class="bg-wood">
        <FolderList/>
      </section>
      <section style="min-width:420px;height:100%;" class="bg-wood">
        <TitleList/>
      </section>
      <section style="min-width:600px;width:calc(100% - 670px);height:100%">
        <Editor/>
      </section>
    </q-page-container>
  </q-layout>
</template>

<script>
import FolderList from './FolderList.vue'
import TitleList from './TitleList.vue'
import Editor from './Editor.vue'
// import itheima from 'itheima-utils'
export default {
  data () {
    return {
      model: 'white',
      drawer: false,
      miniState: true,
      link: 'inbox'
    }
  },
  watch: {
    // '$store.state.notes.temp.content' (val) { // 造成性能问题
    //   document.getElementById('editor').children[0].innerHTML = unescape(val)
    // }
  },
  mounted () {
    this.$q.notify({
      message: '欢迎使用便签',
      html: true,
      color: 'green',
      timeout: 1000
    })
  },
  methods: {
    async saveContent () {
      const content = document.getElementById('editor').children[0].innerHTML
      const contentEscape = escape(content)
      console.log(contentEscape)
      const { folderId, noteId, noteIndex, contentBackup } = this.$store.state.notes.temp
      if (content === contentBackup) {
        this.$q.notify({
          message: '内容未修改',
          html: true,
          color: 'warning',
          timeout: 1000
        })
        return
      }
      const { status } = await this.$axios.post(`/notes/${noteId}/content`, {
        folderId,
        content: contentEscape
      })
      if (status === 200) {
        this.$q.notify({
          message: '保存成功',
          html: true,
          color: 'positive',
          timeout: 1000
        })
        this.$store.state.notes.notes[folderId][noteIndex].content = content
        this.$store.state.notes.temp.contentBackup = content
      } else {
        this.$q.notify({
          message: '保存失败',
          html: true,
          color: 'warning',
          timeout: 1000
        })
      }
    }
  },
  components: {
    FolderList,
    TitleList,
    Editor
  }
}
</script>
