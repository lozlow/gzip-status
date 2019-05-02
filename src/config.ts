import * as vscode from 'vscode';

const Config = {
    get() {
        return vscode.workspace.getConfiguration().get('gzip-status') as any;
    }
};

export default Config;
