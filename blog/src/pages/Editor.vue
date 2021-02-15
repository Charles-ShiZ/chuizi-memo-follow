<style lang="scss">
.editor-wrap{
height: 100%;
position:relative;
// animation:myfirst 0.5s;
// -webkit-animation:myfirst 0.5s; /* Safari and Chrome */
}
@keyframes myfirst
{
  0%{
      // transform: translate(0px,0px);
      width: 80%;
      height: 80%;
  }
  25%{
      transform: translate(-100px,75px);
            width: 60%;
      height: 60%;
  }
  50%{
      transform: translate(-200px,175px);
            width: 40%;
      height: 40%;
  }
  75%{
      transform: translate(-300px,300px);
            width: 30%;
      height: 30%;
  }
  100%{
      transform: translate(-400px,500px);
            width: 20%;
      height: 20%;
  }
}

@-webkit-keyframes myfirst /* Safari and Chrome */
{
  0%{
      // transform: translate(0px,0px);
      width: 80%;
      height: 80%;
  }
  25%{
      transform: translate(-100px,75px);
            width: 60%;
      height: 60%;
  }
  50%{
      transform: translate(-200px,175px);
            width: 40%;
      height: 40%;
  }
  75%{
      transform: translate(-300px,300px);
            width: 30%;
      height: 30%;
  }
  100%{
      transform: translate(-400px,500px);
            width: 20%;
      height: 20%;
  }
}
.ql-editor *{
  font-size:16px;
}
.ql-editor{
  height:calc(100% - 50px)
}
.ql-syntax {
  font-family: Consolas;
  font-weight: bold;
}
.ql-toolbar{
  height: 50px;
  display: flex;
  align-items:center
}
</style>
<template>
  <div class="editor-wrap">
    <div @keyup.ctrl.32.prevent="saveContent()"
      id="editor"
      autocomplete="off"
      autocorrect="off"
      autocapitalize="off"
      spellcheck="false"
    >
    </div>
  </div>
</template>
<script>
import hljs from 'highlight.js/lib/highlight.js'
import 'highlight.js/styles/vs2015.css'
import 'highlight.js'
import Quill from 'quill'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
export default {
  data () {
    return {
    }
  },
  methods: {
    async saveContent () {
      const content = document.getElementById('editor').children[0].innerHTML
      const contentEscape = escape(content)
      const { folderId, noteId, noteIndex, contentBackup } = this.$store.state.notes.temp
      if (content === contentBackup) {
        this.$q.notify({
          message: '内容未修改',
          html: true,
          color: 'orange',
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
  beforeMount () {
  },
  mounted () {
    var options = {
      theme: 'snow',
      theEditor: {},
      modules: {
        toolbar: [
          [{ color: [] }, { background: [] }, { align: [] }, 'bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block', { list: 'ordered' }, { list: 'bullet' }],
          // [{ header: 1 }, { header: 2 }],
          // [{ header: [1, 2, 3, 4, 5, 6, false] }],
          ['link', 'image', 'video'],
          [{ size: ['small', 'medium', 'large', 'huge', 'false'] }]
        ],
        syntax: {
          highlight: text => hljs.highlightAuto(text).value
        }
      }
    }
    this.editor = new Quill('#editor', options)
    document.getElementById('editor').children[0].innerHTML = this.$store.state.editorDefault
  }
}
</script>
