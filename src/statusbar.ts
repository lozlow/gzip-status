import * as vscode from 'vscode';
import Config from './config';
import * as gzip from 'gzip-js';
import * as filesize from 'filesize.js';

class Statusbar {
    icon: vscode.StatusBarItem;
    config: { level: number; };

    init() {
        this.initIcon();
        this.update();
        vscode.workspace.onDidChangeConfiguration(this.update.bind(this));
        //vscode.workspace.onDidSaveTextDocument(this.update.bind(this));
        vscode.workspace.onDidChangeTextDocument(this.update.bind(this));
        vscode.window.onDidChangeActiveTextEditor(this.update.bind(this));
    }

    initIcon() {
        const config = Config.get();
        const alignment = config.alignment === 'left' ? vscode.StatusBarAlignment.Left : vscode.StatusBarAlignment.Right;
        this.icon = vscode.window.createStatusBarItem(alignment, -Infinity);
        //this.icon.command = '';
    }

    update() {
        this.config = Config.get();
        const options = {
            level: this.config.level,
        };
        if (vscode.window.activeTextEditor) {
            this.icon.text = `$(file-zip) ${filesize(gzip.zip(vscode.window.activeTextEditor.document.getText(), options).length)}`;
            this.icon.show();
        }
        else {
            this.icon.hide();
        }
    }
}

const statusbar = new Statusbar();

export default statusbar;
