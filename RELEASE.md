* Checkout the code on a machine with a desktop
    The `vsce publish` command seems to require a desktop environment.
* Install bun
```
curl -fsSL https://bun.sh/install | bash
```
* Install [nodejs and npm](https://nodejs.org/en/download/package-manager/).
* Install vsce
```
bun install -g vsce
vsce -h # check
```
* Install typescript
```
bun install -g typescript
tsc -h
```
* Install local dependencies
```
bun install
```
* Go into the folder of this repo, e.g. `cd vscode-find-in-current-file`
* Edit `version` in package.json, e.g. increase minor version by 1.
* Edit CHANGELOG.md
* Build extension release package with `vsce package`
* Install the extension locally with `code --install-extension find-in-current-file-x.y.z.vsix --force` and validate the extension is working as expected.
* Release the extension to vscode marketplace with `vsce publish`. You will be prompted for the marketplace token. Or you can publish directly with `vsce publish -p <azure personal access token>`.
    Get the personal access token from `https://dev.azure.com/<orgnization>/`, i.e., `https://dev.azure.com/peterjpxie/` in my case.

Alternatively you can publish the extension via the marketplace web portal (sometimes does not work).
* Login https://marketplace.visualstudio.com/vscode
* Click 'Publish extensions' 
* Click 'New extension'/'vs code' and upload the `find-in-current-file-x.y.z.vsix` file built by vsce.
* It takes a few minutes to approve.
* Then search the extension in the marketplace by the full name with double quote, e.g. "find in current file", to confirm.
