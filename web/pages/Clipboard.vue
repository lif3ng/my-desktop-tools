<template>
  <div>
    剪贴板
    <fieldset>
      <legend>{{ board.type }}</legend>
      <template v-if="board.type === 'img'">
        <img :src="board.img" />
      </template>
      <template v-else-if="board.type === 'html'">
        <span v-html="board.html" />
      </template>
      <template v-else-if="board.type === 'text'">
        {{ board.text }}
      </template>
      <template v-if="board.text">
        <nq-button @click="handleTranslate" v-if="!trans">翻译</nq-button>
        <nq-button @click="handleOpenGoolgle">google trans</nq-button>
        <nq-button @click="handleOpenYoudao">youdao trans</nq-button>
        <div v-if="trans">google:{{ trans }}</div>
        <div v-if="transYoudao">youdao:{{ transYoudao }}</div>
      </template>
    </fieldset>
  </div>
</template>
<script>
handleGoogleTranslateRes = (e, { sentences: [{ trans }] }) => {
  this.trans = trans;
};
export default {
  data() {
    return {
      timer: null,
      board: {},
      history: [],
      trans: "",
      transYoudao: "",
    };
  },
  mounted() {
    console.log(this);
    this.timer = setInterval(this.refreshClipboard, 1000);
    ipcRenderer.on("translate-result", handleGoogleTranslateRes);
  },
  beforeDestroy() {
    clearInterval(this.timer);
    ipcRenderer.removeListener("translate-result", handleGoogleTranslateRes);
  },
  watch: {
    "board.text": {
      deep: true,
      handler(x, y) {
        console.log(x, y);
        this.trans = "";
        this.transYoudao = "";
      },
    },
  },
  methods: {
    refreshClipboard() {
      let type;
      const text = clipboard.readText();
      const html = clipboard.readHTML();
      const image = clipboard.readImage();
      if (image.getSize().width) {
        type = "img";
      } else if (html) {
        type = "html";
      } else {
        type = "text";
      }

      if (
        type !== this.board.type ||
        (type === "text" && text !== this.board.text) ||
        (type === "html" && html !== this.board.html) ||
        (type === "img" && image.toDataURL() !== this.board.img)
      ) {
        this.history.push(this.board);

        this.board = {
          type,
          date: +new Date(),
          ...(type === "html" && { html, text }),
          ...(type === "text" && { text }),
          ...(type === "img" && { img: image.toDataURL(), html }),
        };
      }
    },
    handleOpenGoolgle() {
      shell.openExternal(
        `https://translate.google.cn/#view=home&op=translate&sl=en&tl=zh-CN&text=${encodeURIComponent(
          this.board.text
        )}`
      );
    },
    handleOpenYoudao() {
      shell.openExternal(
        `http://dict.youdao.com/w/eng/${encodeURIComponent(this.board.text)}`
      );
    },
    handleTranslate() {
      fetch(
        `http://fanyi.youdao.com/translate?&doctype=json&type=AUTO&i=${encodeURIComponent(
          this.board.text
        )}`
      )
        .then((r) => r.json())
        .then(({ translateResult: [[{ tgt }]] }) => {
          this.transYoudao = tgt;
        });
      ipcRenderer.invoke("translate", this.board.text);
    },
  },
};
</script>
