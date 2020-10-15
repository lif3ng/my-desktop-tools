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
    </fieldset>
  </div>
</template>
<script>
export default {
  data() {
    return {
      timer: null,
      board: {},
      history: [],
    };
  },
  mounted() {
    console.log(this);
    this.timer = setInterval(this.refreshClipboard, 1000);
  },
  beforeDestroy() {
    clearInterval(this.timer);
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
        text !== this.board.text ||
        html !== this.board.html ||
        image.toDataURL !== this.board.img
      ) {
        this.history.push(this.board);
        this.board = {
          type,
          date: +new Date(),
          ...(type === "html" && { html, text }),
          ...(type === "text" && { text }),
          ...(type === "img" && { img: image.toDataURL() }),
        };
      }
    },
  },
};
</script>
