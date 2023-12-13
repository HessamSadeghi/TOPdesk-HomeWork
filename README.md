# TOPdesk-HomeWork

mkdir TOPdesk-HomeWork
cd TOPdesk-HomeWork
npm init -y
npm install express node-fetch webpack webpack-cli
npm install -D clean-webpack-plugin css-loader html-webpack-plugin mini-css-extract-plugin style-loader

npx webpack --config webpack.config.js
node server/server.js

npm install -g serve
cd dist
serve
