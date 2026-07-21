import * as vscode from "vscode";
import * as path from "path";

export function activate(context: vscode.ExtensionContext) {
  let findDisposable = vscode.commands.registerCommand(
    "find-in-current-file.searchInCurrentFile",
    async () => {
      await searchInCurrentFile();
    }
  );

  context.subscriptions.push(findDisposable);

  // Register the replace in current file command
  let replaceDisposable = vscode.commands.registerCommand(
    "find-in-current-file.replaceInCurrentFile",
    async () => {
      await replaceInCurrentFile();
    }
  );

  context.subscriptions.push(replaceDisposable);
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

/**
 * Resolve the current file's path (relative to workspace) suitable for
 * use with "files to include" in the find/replace panel.
 *
 * Returns undefined when there is no active editor.
 */
function getCurrentFileFilter(): string | undefined {
  const activeEditor = vscode.window.activeTextEditor;
  if (!activeEditor) {
    return undefined;
  }

  let currentFilePath = vscode.workspace.asRelativePath(
    activeEditor.document.uri
  );

  // Support files added to workspace by SSH FS
  currentFilePath = remove_SSHFS_prefix(currentFilePath);

  return currentFilePath;
}

/**
 * Common logic: open the Find in Files panel pre-filled for the current file.
 * When openReplace is true, we additionally trigger the replace UI afterwards.
 */
async function openFindInCurrentFile(openReplace: boolean): Promise<void> {
  const filesToInclude = getCurrentFileFilter();
  if (!filesToInclude) {
    return;
  }
  // we are sure activeTextEditor is not-null here, so we add ! mark here.
  const activeEditor = vscode.window.activeTextEditor!;
  const query = activeEditor.document.getText(activeEditor.selection);

  // 'onlyOpenEditors: true' makes the following scenarios working:
  // - After opening a folder workspace, add a file directly outside the folder and search on it. 
  //  The file filter shows full path, e.g. /home/peter/a.txt or D:/a/a.txt.
  //  Otherwise, it also has a side effect that the search never completes and you cannot stop it. 
  await vscode.commands.executeCommand("workbench.action.findInFiles", {
    query,
    filesToInclude,
    onlyOpenEditors: true,
  });

  if (openReplace) {
    // This opens the replacement input fields without resetting the configuration
    // from the last step.
    await vscode.commands.executeCommand("workbench.action.replaceInFiles");
  }
}

async function searchInCurrentFile(): Promise<void> {
  await openFindInCurrentFile(false);
}

async function replaceInCurrentFile(): Promise<void> {
  await openFindInCurrentFile(true);
}
