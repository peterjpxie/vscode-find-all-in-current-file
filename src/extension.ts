import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    "find-in-current-file.searchInCurrentFile",
    async () => {
      await searchInCurrentFile();
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}

// Remove SSH FS prefix
// e.g., "SSH FS - controller_v5/home/zoneworksxt/3rd.txt"
//      -> home/zoneworksxt/3rd.txt"
function remove_SSHFS_prefix(str: string): string {
  const prefix = "SSH FS - ";
  // Check if the string starts with the prefix
  if (str.startsWith(prefix)) {
      // Find the position of the first slash character after the prefix
      const firstSlashIndex = str.indexOf("/", prefix.length - 1);
      // If a slash is found, return the substring starting after that slash
      if (firstSlashIndex !== -1) {
          return str.substring(firstSlashIndex + 1);
      }
  }
  // Return the original string if the prefix is not found or no slash is found
  return str;
}


async function searchInCurrentFile(): Promise<void> {
  const activeEditor = vscode.window.activeTextEditor;
  if (!activeEditor) {
    return;
  }

  var currentFilePath = vscode.workspace.asRelativePath(
    activeEditor.document.uri
  );
  
  // Workaround for issue #9
  // Take only basename if it is a Windows full path with colon (:), e.g. D:\a\b.txt -> b.txt 
  if (currentFilePath.includes(":")) {
    const path = require('path');
    currentFilePath = path.basename(currentFilePath);
  }

  // Support files added to workspace by SSH FS
  currentFilePath = remove_SSHFS_prefix(currentFilePath);

  await vscode.commands.executeCommand("workbench.action.findInFiles", {
    // Fill-in selected text to query
    query: activeEditor.document.getText(activeEditor.selection),
    filesToInclude: currentFilePath,
  });
}
