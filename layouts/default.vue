<template>
  <div id="app" ng-cloak>
    <nuxt />
  </div>
</template>

<style>
ng-cloak {
  display: none !important;
}
html {
  font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

body {
  /*  background: #f0f2f5; */
}

*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}
.hide {
  display: none;
  visibility: hidden;
}

a.link-footer {
  color: black !important;
  text-decoration-line: none;
  text-decoration: none;
}
a.link-footer:hover {
  text-decoration: inherit;
  text-decoration-line: underline;
}

.ant-layout-content.app-content {
  padding: 0 50px;
  margin-top: 50px;
  max-width: 1300px;
  margin-left: auto;
  margin-right: auto;
}
</style>
