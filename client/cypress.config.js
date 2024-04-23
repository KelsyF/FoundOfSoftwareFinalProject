const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      require('@cypress/code-coverage/task')(on, config)
      return config
    },
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
