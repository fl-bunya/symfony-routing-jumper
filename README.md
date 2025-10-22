# Symfony Routing Jumper

VS Code拡張「Symfony Routing Jumper」は、Symfony 1.x プロジェクトの `routing.yml` からコントローラのアクション定義へジャンプできる機能を提供します。

## 主な機能
- `apps/{appName}/config/routing.yml` 内の `action:` キーの値をクリックすると、対応する `actions.class.php` の該当アクション定義へジャンプします。
- `module:` キーの値は、同じブロックまたは上の行から自動取得されます。
- アプリ名（frontend, company など）は routing.yml のパスから自動判定されます。

## 使い方
1. VS Code で Symfony プロジェクトを開きます。
2. `routing.yml` ファイルを開きます。
3. `action:` の値（例: `action: index`）をCtrl+クリック（またはF12）でジャンプできます。

## 対応パス例
- `apps/frontend/config/routing.yml`
- `apps/company/config/routing.yml`

## インストール方法
1. このリポジトリをクローンまたはダウンロード
2. `npm install`
3. `npx vsce package` で `.vsix` ファイルを作成
4. VS Code で拡張機能としてインストール

## 開発・テスト
- `npm run watch` でTypeScriptの自動ビルド
- `npm run watch-tests` でテストの自動実行

## ライセンス
MIT
