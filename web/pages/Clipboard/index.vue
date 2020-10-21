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
        <nq-button
          @click="handleTranslate"
          v-if="youdaoResData.length === 0 && googleResData.length === 0"
          >翻译</nq-button
        >
        <nq-button @click="handleOpenGoolgle">google trans</nq-button>
        <nq-button @click="handleOpenYoudao">youdao trans</nq-button>
        <div v-if="googleResData.length">
          google:
          <trans-res-view :type="googleShowType" :data="googleResData" />
          <button @click="toggleShowType('google')">
            {{ googleShowType === "all" ? "逐句" : "完整" }}
          </button>
        </div>
        <div v-if="youdaoResData.length">
          youdao:
          <trans-res-view :type="youdaoShowType" :data="youdaoResData" />
          <button @click="toggleShowType('youdao')">
            {{ youdaoShowType === "all" ? "逐句" : "完整" }}
          </button>
        </div>
      </template>
    </fieldset>
  </div>
</template>
<script>
import TransResView from "./TransResView";
export default {
  components: { TransResView },
  data() {
    return {
      timer: null,
      board: {},
      history: [],
      googleResData: [],
      youdaoResData: [],
      googleShowType: "all",
      youdaoShowType: "all",
    };
  },
  mounted() {
    console.log(this);
    this.timer = setInterval(this.refreshClipboard, 1000);
  },
  beforeDestroy() {
    clearInterval(this.timer);
    ipcRenderer.removeListener(
      "translate-result",
      this.handleGoogleTranslateRes
    );
  },
  watch: {
    "board.text": {
      deep: true,
      handler(x, y) {
        console.log(x, y);
        this.googleResData = [];
        this.youdaoResData = [];
      },
    },
  },
  methods: {
    handleGoogleTranslateRes(e, { sentences }) {
      console.log("google", { sentences });
      this.trans = sentences.map(({ trans }) => trans).join(" ");
    },
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
    toggleShowType(name) {
      this[`${name}ShowType`] = this[`${name}ShowType`] === "all" ? "" : "all";
    },
    handleTranslate() {
      fetch(
        `http://fanyi.youdao.com/translate?&doctype=json&type=AUTO&i=${encodeURIComponent(
          this.board.text
        )}`
      )
        .then((r) => r.json())
        .then(({ translateResult, translateResult: [[{ tgt }]] }) => {
          console.log("youdao", translateResult);
          this.youdaoResData = translateResult.reduce((arr, list) => {
            console.log(arr, list);
            arr.push(
              ...list
                .map(({ src, tgt }) => ({
                  origin: src,
                  target: tgt,
                }))
                .filter(({ origin }) => origin)
            );
            return arr;
          }, []);
        });

      fetch(
        `http://translate.google.cn/translate_a/single?client=gtx&dt=t&dj=1&ie=UTF-8&sl=auto&tl=zh-CN&q=${encodeURIComponent(
          this.board.text
        )}`
      )
        .then((r) => r.json())
        .then(({ sentences }) => {
          this.googleResData = sentences.map(({ orig, trans }) => ({
            origin: orig,
            target: trans,
          }));
        });
    },
  },
};
</script>
