import * as vscode from 'vscode';
import Config from './config';
import * as gzip from 'gzip-js';
import filesize from 'filesize.js';
import { debounce } from 'lodash';

function calculateFileSize (text: string, options) {
    const zipSize = filesize(gzip.zip(text, options).length)
    const fileSize = filesize(new Buffer(text).length)

    return {
        zipSize,
        fileSize
    }
}

class Statusbar {
    icon: vscode.StatusBarItem;
    config: { level: number; };
    calculateFileSize;

    init() {
        this.initIcon();
        this.update();
        vscode.workspace.onDidChangeConfiguration(this.update.bind(this));
        //vscode.workspace.onDidSaveTextDocument(this.update.bind(this));
        vscode.workspace.onDidChangeTextDocument(this.update.bind(this));
        vscode.window.onDidChangeActiveTextEditor(this.update.bind(this));
        this.calculateFileSize = debounce(calculateFileSize, 1000, { maxWait: 4000, leading: true})
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
            const { zipSize, fileSize } = this.calculateFileSize(vscode.window.activeTextEditor.document.getText(), options)
            this.icon.text = `File size: ${fileSize} (gzipped: ${zipSize})`
            this.icon.show();
        }
        else {
            this.icon.hide();
        }
    }
}

const statusbar = new Statusbar();

export default statusbar;
