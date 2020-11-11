module.exports = {
  presets: [["@babel/preset-env", { targets: { node: "current" } }]],
  plugins: [
    "@babel/plugin-syntax-class-properties",
    "@babel/plugin-proposal-class-properties",
  ],
};
