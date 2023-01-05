# tRPC playground

## 開発環境

- Node.js v18.x
- Yarn v1.x
- macOS Ventura

## セットアップ

### 1.GitHub からリポジトリをクローン

GitHub からリポジトリをクローンしてください。

```shell
$ git clone git@github.com:hisho/trpc-next-playground.git
$ cd trpc-next-playground
```

### 2.dockerの起動

```shell
$ docker-compose up
```

### 3.依存パッケージのインストール

package.json に記載されている依存パッケージをインストールしてください。

```shell
$ yarn
```

### 4.migrateの実装

```shell
$ yarn db:migrate
```

### 5.開発環境を起動しブラウザで確認

開発環境を起動し、ブラウザで確認してください。

```shell
$ yarn dev
$ open http://localhost:3000
```