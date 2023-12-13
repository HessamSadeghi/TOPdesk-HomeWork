# TOPdesk-HomeWork

mkdir TOPdesk-HomeWork
cd TOPdesk-HomeWork
npm init -y
npm install express webpack webpack-cli node-fetch
npm install html-webpack-plugin --save-dev
npm install style-loader css-loader --save-dev

npx webpack --config webpack.config.js
node server/server.js

npm install -g serve
cd dist
serve
