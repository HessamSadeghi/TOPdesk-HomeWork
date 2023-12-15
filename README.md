# TOPdesk-HomeWork

mkdir TOPdesk-HomeWork
cd TOPdesk-HomeWork
npm init -y
npm install express webpack
npm install -D css-loader html-webpack-plugin mini-css-extract-plugin webpack-cli

npx webpack --config webpack.config.js
node server/server.js

npm install -g serve
cd dist
serve
