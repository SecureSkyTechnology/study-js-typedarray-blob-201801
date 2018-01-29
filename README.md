# study-js-typedarray-blob-201801
JavaScript での Typed ArrayBuffer, Blob, FileReader API, Buffer(Node) の使い方について2018年1月に勉強したときのサンプルコード

## 始め方

```
$ npm install
$ npm run lint
$ npm run build
$ npm run test
$ npm run start
-> ブラウザで http://localhost:9000/ にアクセス

webpackによる変更監視 & 即時ビルド:
$ npm run build:w
```

## 勉強時のログ

### ステップ1. webpackの最小構成

- 最新版で学ぶwebpack 3入門(図解付き) - JS開発で必須のモジュールバンドラー - ICS MEDIA
- https://ics.media/entry/12140
- イマイチ webpack-dev-server が期待通りに動いてくれなかった。また、Cygwin上から実行するとCtrl-Cでのプロセス終了がうまく行かず、バックグラウンドのnodeプロセスが残ってしまい、もう一度実行するとポート番号使用中(EADDRINUSE)で失敗してしまう。
- Cygwin上からのCtrl-Cの問題については、一旦、Webサーバを動かすのはコマンドプロンプトからに変更する。コマンドプロンプトからであれば、Ctrl-CでバックグラウンドのNodeプロセスも終了する。
一方、webpack-dev-serverについてはファイルのビルドがうまく反映されないという問題がある。
  - こちらについてはより単純なnode-staticを使うことにして、こちらをコマンドプロンプトで常時実行し、Cygwinターミナル上では通常のnpmビルド処理を行う、という風に分割する。
  - https://www.npmjs.com/package/node-static
- これで、webpackでビルドしたJSをHTMLでロードしてブラウザ上でアクセスして動かすことができるようになった。

### ステップ2. webpack + babel の最小構成

- 最新版で学ぶwebpack 3入門 - BabelでES2017環境の構築(React, Three.js, jQueryのサンプル付き) - ICS MEDIA
- https://ics.media/entry/16028
- これで webpack + babel で、async/await を使ったJSをブラウザ用JSにtranspileして、ブラウザ上で動作確認できるようになった。また、npmでインストールしたjqueryを、babel transpileを通じて使用する方法がわかった。

### ステップ3. Mochaによるテスト環境構築

- https://mochajs.org/
- かなりいろいろな組み合わせで使われているので、どう組み合わせれば良いのか迷った。
- やりたい事としては、npm run test でNode.js想定のテストを動かし、同時にブラウザ用のJSも出力してブラウザ上でMochaの実行も確認したい。
- つまり、webpackで2種類のJSを生成し、1つはnpm run testによるNode.js環境のテストを実行し、もう片方はHTMLで読み込み、ブラウザアクセスで動作確認できるテストとする。
- ブラウザ上のテストをnodeから制御する Karma については、現時点の理解力キャパシティを超えていたので見送る。
- 最終的に以下を参考にしつつ、webpack3 + babel6 ビルド用に試行錯誤して、なんとか構築できた筈。ただ、技術的な詳細を調べきれず、とりあえずエラー無く期待通りに動かせただけなので、無駄があったり、実は間違ってて結果として動いてるだけ、ということもあるかもしれない。
  - https://qiita.com/hnakamur/items/d0b3dcd133471eb5123f
  - http://phiary.me/javascript-test-framework-mocha-borwser-usage/

### ステップ4. power-assertの利用

- https://github.com/power-assert-js/power-assert
- babel6以上を利用する場合は https://github.com/power-assert-js/babel-preset-power-assert 一択。

入れてみて、webpack の loader のpresets に 'power-assert' を追加してみたが、ビルドで以下のエラー。
```
ERROR in ./node_modules/estraverse/estraverse.js
Module build failed: Error: Couldn't find preset "es2015" relative to directory ...
```

`$ npm i -D babel-preset-es2015` で直った。presetsに 'es2015' を追加する必要は無かった。ただインストール時に「もう古いよ」という主旨のメッセージがちらっと見えた(詳細失念)ので、これで直して本当に良かったのか微妙・・・。

以下のWARNINGは出る。
```
WARNING in ./node_modules/power-assert-formatter/lib/create.js
30:28-49 Critical dependency: the request of a dependency is an expression
```
ただ、これはあくまでもWARNINGなので、動作自体には支障ないらしい。
via : https://github.com/power-assert-js/babel-plugin-espower/issues/14#issuecomment-197272436

また、この状態で `var assert = require('assert')` すれば、assertが自動的にpower-assertに切り替わる。便利。
