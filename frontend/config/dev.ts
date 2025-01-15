module.exports = {
  env: {
    NODE_ENV: '"development"',
  },
  defineConstants: {},
  mini: {
    webpackChain(chain: any) {
      chain.plugin('miniCssExtractPlugin').tap((args: any) => {
        args[0].ignoreOrder = true; // 忽略 CSS 顺序冲突
        return args;
      });
    },
  },
  h5: {},
};
