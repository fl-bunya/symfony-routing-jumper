import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export function activate(context: vscode.ExtensionContext) {
  const provider: vscode.DefinitionProvider = {
    provideDefinition(document, position) {
      const range = document.getWordRangeAtPosition(position, /[A-Za-z0-9_]+/);
      if (!range) return;

      const word = document.getText(range);

      // 行全体を取得
      const line = document.lineAt(position).text;

      // "module: xxx" or "action: yyy" をパース
      if (line.includes('module:')) {
        return jumpToActionFile(document.uri, word, null);
      } else if (line.includes('action:')) {
        // module の値を探す（上の行や同じブロック）
        const module = findModuleAbove(document, position.line);
        return jumpToActionFile(document.uri, module, word);
      }
    }
  };

  context.subscriptions.push(
    vscode.languages.registerDefinitionProvider(
      { pattern: '**/*routing.yml' },  // ファイル名が routing.yml ならどこでも
      provider
    )
  );
}

function findModuleAbove(document: vscode.TextDocument, line: number): string | null {
  for (let i = line; i >= 0; i--) {
    const text = document.lineAt(i).text;
    const match = text.match(/module:\s*(\w+)/);
    if (match) return match[1];
  }
  return null;
}

function jumpToActionFile(uri: vscode.Uri, module: string | null, action: string | null) {
  if (!module) return;

  const root = vscode.workspace.getWorkspaceFolder(uri);
  if (!root) return;

  const filePath = path.join(root.uri.fsPath, 'apps/frontend/modules', module, 'actions', 'actions.class.php');

  if (!fs.existsSync(filePath)) return;

  const target = vscode.Uri.file(filePath);

  if (!action) {
    return new vscode.Location(target, new vscode.Position(0, 0));
  }

  const text = fs.readFileSync(filePath, 'utf-8');
  const regex = new RegExp(`function\\s+execute${capitalize(action)}\\s*\\(`);
  const lines = text.split(/\r?\n/);

  for (let i = 0; i < lines.length; i++) {
    if (regex.test(lines[i])) {
      return new vscode.Location(target, new vscode.Position(i, 0));
    }
  }

  return new vscode.Location(target, new vscode.Position(0, 0));
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
