const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    waitForAnimations: true,
    delay: 300,
  },

  component: {
    devServer: {
      framework: "create-react-app",
      bundler: "webpack",
    },
  },
});
