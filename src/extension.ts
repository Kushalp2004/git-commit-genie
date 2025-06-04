import * as vscode from 'vscode';
import { exec } from 'child_process';
import { getCommitMessageFromGemini } from '../ai/gemini';

export function activate(context: vscode.ExtensionContext) {
	// Rule-based command
	const basicCmd = vscode.commands.registerCommand('git-commit-summarizer.generateCommitMessage', () => {
		vscode.window.withProgress({
			location: vscode.ProgressLocation.Notification,
			title: "📏 Generating rule-based commit message...",
			cancellable: false
		}, async () => {
			const diff = await getGitDiff();
			if (!diff) {
				vscode.window.showWarningMessage('No staged changes found.');
				return;
			}

			const commitType = detectCommitType(diff);
			const changedFiles = Array.from(diff.matchAll(/^diff --git a\/(.+?) b\/\1$/gm)).map(m => m[1]);
			const added = (diff.match(/^\+[^+]/gm) || []).length;
			const removed = (diff.match(/^-[^-]/gm) || []).length;

			const summary = changedFiles.map(file => {
				if (file.endsWith('.html')) return `Update HTML (${file})`;
				if (file.endsWith('.js')) return `Update logic (${file})`;
				if (file.endsWith('.css')) return `Update styles (${file})`;
				return `Modify ${file}`;
			}).join(', ');

			const finalMessage = `${commitType}: ${summary} – ${added} lines added, ${removed} removed`;

			showCommitOptions(finalMessage);
		});
	});

	// Gemini AI command
	const aiCmd = vscode.commands.registerCommand('git-commit-summarizer.generateAICommitMessage', () => {
		vscode.window.withProgress({
			location: vscode.ProgressLocation.Notification,
			title: "🔮 Generating AI commit message with Gemini...",
			cancellable: false
		}, async () => {
			const diff = await getGitDiff();
			if (!diff) {
				vscode.window.showWarningMessage('No staged changes found.');
				return;
			}

			const aiMessage = await getCommitMessageFromGemini(diff);
			showCommitOptions(aiMessage);
		});
	});

	context.subscriptions.push(basicCmd, aiCmd);
}

function detectCommitType(diff: string): string {
	const text = diff.toLowerCase();
	if (text.includes('fix') || text.includes('bug')) return 'fix';
	if (text.includes('add') || text.includes('new') || text.includes('feature')) return 'feat';
	if (text.includes('refactor') || text.includes('clean')) return 'refactor';
	if (text.includes('readme') || text.includes('.md')) return 'docs';
	if (text.includes('test') || text.includes('spec')) return 'test';
	return 'chore';
}

function showCommitOptions(message: string) {
	vscode.window.showQuickPick(
		[`💬 Use: ${message}`, `📋 Copy to Clipboard`, `❌ Cancel`],
		{ placeHolder: "How do you want to use this message?" }
	).then(async (choice) => {
		if (choice?.startsWith('💬')) {
			await insertIntoSourceControlInput(message);
			vscode.window.showInformationMessage('✅ Commit message inserted.');
		} else if (choice?.startsWith('📋')) {
			await vscode.env.clipboard.writeText(message);
			vscode.window.showInformationMessage('📋 Copied to clipboard.');
		}
	});
}

async function insertIntoSourceControlInput(message: string) {
	const gitExtension = vscode.extensions.getExtension('vscode.git')?.exports;
	const api = gitExtension?.getAPI(1);
	const repo = api?.repositories[0];
	if (!repo) {
		vscode.window.showErrorMessage('No Git repository found.');
		return;
	}
	repo.inputBox.value = message;
}

function getGitDiff(): Promise<string | null> {
	return new Promise((resolve) => {
		exec('git diff --cached', { cwd: vscode.workspace.rootPath }, (error, stdout, stderr) => {
			if (error || stderr) {
				console.error('Git error:', error || stderr);
				resolve(null);
				return;
			}
			resolve(stdout.trim());
		});
	});
}

export function deactivate() {}
