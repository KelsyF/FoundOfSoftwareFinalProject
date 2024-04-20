const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    waitForAnimations: true,
  },

  component: {
    devServer: {
      framework: "create-react-app",
      bundler: "webpack",
    },
  },
});
