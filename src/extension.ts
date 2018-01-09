'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the necessary extensibility types to use in your code below
import {window, workspace, commands, Disposable, ExtensionContext, StatusBarAlignment, StatusBarItem, TextDocument} from 'vscode';

// This method is called when your extension is activated. Activation is
// controlled by the activation events defined in package.json.
export function activate(context: ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error).
    // This line of code will only be executed once when your extension is activated.
    console.log('Congratulations, your extension "Readability" is now active!');

    // Create the readability check
    let readabilityCheck = new ReadabilityCheck();
    let controller = new ReadabilityCheckController(readabilityCheck);

    let disposable = commands.registerCommand('extension.checkReadability', () => {
        readabilityCheck.updateReadability();
    });

    // Add to a list of disposables which are disposed when this extension is deactivated.
    context.subscriptions.push(readabilityCheck);
    context.subscriptions.push(controller);
    context.subscriptions.push(disposable);
}

class ReadabilityCheck {

    private _statusBarItem: StatusBarItem;

    public updateReadability() {

        // Create as needed
        if (!this._statusBarItem) {
            this._statusBarItem = window.createStatusBarItem(StatusBarAlignment.Left);
        }

        // Get the current text editor
        let editor = window.activeTextEditor;
        if (!editor) {
            this._statusBarItem.hide();
            return;
        }

        let doc = editor.document;

        // Only update status if a Markdown or plaintext file
        if ((doc.languageId === "markdown") || (doc.languageId === "plaintext")) {
            const configuredFormula = workspace.getConfiguration().get('readabilityCheck.formula');

            let formula = 'Readability';
            let readability = 0;

            switch (configuredFormula) {
                case 'flesch':
                    formula = 'Flesch Reading Ease';
                    readability = this._getFlesch(doc);
                    break;
                case 'flesch-kincaid':
                    formula = 'Flesch-Kincaid Grade Level';
                    readability = this._getFleschKincaid(doc);
                    break;
                case 'coleman-liau':
                    formula = 'Coleman-Liau Index';
                    readability = this._getColemanLiau(doc);
                    break;
                case 'dale-chall':
                    formula = 'Dale-Chall Readability';
                    readability = this._getDaleChall(doc);
                    break;
                case 'smog':
                    formula = 'SMOG Formula';
                    readability = this._getSMOG(doc);
                    break;
                case 'spache':
                    formula = 'Spache Readability';
                    readability = this._getSpache(doc);
                    break;
                default:
                    formula = 'Automated Readability';
                    readability = this._getAutomatedReadability(doc);
                    break;
            }

            // Update the status bar
            this._statusBarItem.text = `${formula} score: ${readability}`;
            this._statusBarItem.show();
        } else {
            this._statusBarItem.hide();
        }
    }

    public _getAutomatedReadability(doc: TextDocument): number {
        let autoRead = 0;

        let sentenceCount = this._getSentenceCount(doc);
        console.log("Sentence count: " + sentenceCount);

        let wordCount = this._getWordCount(doc);
        console.log("Word count: " + wordCount);

        let charCount = this._getCharacterCount(doc);
        console.log("Character count: " + charCount);

        // Calculate readability based on the Automated Readability Index formula
        autoRead = (4.71 * (charCount / wordCount)) + (0.5 * (wordCount / sentenceCount)) - 21.43;
        console.log("Calculated Automatic Readability score: " + autoRead);

        return Math.round(autoRead);
    }

    public _getColemanLiau(doc: TextDocument): number {
        let colemanLiauRead = 0;

        let sentenceCount = this._getSentenceCount(doc);
        console.log("Sentence count: " + sentenceCount);

        let wordCount = this._getWordCount(doc);
        console.log("Word count: " + wordCount);

        let charCount = this._getCharacterCount(doc);
        console.log("Syllable count: " + charCount);

        // Calculate readability based on the Coleman-Liau index formula
        colemanLiauRead = (0.0588 * ((charCount / wordCount) * 100)) - (0.296 * ((sentenceCount / wordCount) * 100)) - 15.8
        console.log("Calculated Coleman-Liau index score: " + colemanLiauRead);

        return Math.round(colemanLiauRead);
    }

    public _getDaleChall(doc: TextDocument): number {
        let daleChallRead = 0;

        let sentenceCount = this._getSentenceCount(doc);
        console.log("Sentence count: " + sentenceCount);

        let wordCount = this._getWordCount(doc);
        console.log("Word count: " + wordCount);

        let difficultWordCount = this._getDifficultWordCount(doc, "dale-chall");
        console.log("Syllable count: " + difficultWordCount);

        let difficultWordPercentage = (difficultWordCount / wordCount) * 100;

        // Calculate readability based on the Dale-Chall Readability Formula
        daleChallRead = (0.1579 * difficultWordPercentage) + (0.0496 * (wordCount / sentenceCount))
        // Account for the raw score offset if the difficult word percentage is above 5%
        daleChallRead += (difficultWordPercentage > 5) ? 3.6365 : 0;
        console.log("Calculated Dale Chall Readability Formula score: " + daleChallRead);

        return Math.round(daleChallRead);
    }

    public _getFlesch(doc: TextDocument): number {
        let fleschRead = 0;

        let sentenceCount = this._getSentenceCount(doc);
        console.log("Sentence count: " + sentenceCount);

        let wordCount = this._getWordCount(doc);
        console.log("Word count: " + wordCount);

        let syllableCount = this._getSyllableCount(doc);
        console.log("Syllable count: " + syllableCount);

        // Calculate readability based on the Flesch Readability Ease formula
        fleschRead = 206.835 - (1.015 * (wordCount / sentenceCount)) - (84.6 * (syllableCount / wordCount));
        console.log("Calculated Flesch Reading Ease score: " + fleschRead);

        return Math.round(fleschRead);
    }

    public _getFleschKincaid(doc: TextDocument): number {
        let fleschKincaidRead = 0;

        let sentenceCount = this._getSentenceCount(doc);
        console.log("Sentence count: " + sentenceCount);

        let wordCount = this._getWordCount(doc);
        console.log("Word count: " + wordCount);

        let syllableCount = this._getSyllableCount(doc);
        console.log("Syllable count: " + syllableCount);

        // Calculate readability based on the Flesch-Kincaid Grade Level formula
        fleschKincaidRead = (0.39 * (wordCount / sentenceCount)) + (11.8 * (syllableCount / wordCount)) - 15.59;
        console.log("Calculated Flesch-Kincaid U.S. Grade Level score: " + fleschKincaidRead);

        return Math.round(fleschKincaidRead);
    }

    public _getSMOG(doc: TextDocument): number {
        let SMOGRead = 0;

        let sentenceCount = this._getSentenceCount(doc);
        console.log("Sentence count: " + sentenceCount);

        let polysyllableCount = this._getPolysyllabicWordCount(doc);
        console.log("Syllable count: " + polysyllableCount);

        // Calculate readability based on the Flesch-Kincaid Grade Level formula
        SMOGRead = 3.1291 + (1.0430 * Math.sqrt(polysyllableCount * (30 / sentenceCount)));
        console.log("Calculated Simple Measure of Gobbledygook (SMOG) Index score: " + SMOGRead);

        return Math.round(SMOGRead);
    }

    public _getSpache(doc: TextDocument): number {
        let spacheRead = 0;

        let sentenceCount = this._getSentenceCount(doc);
        console.log("Sentence count: " + sentenceCount);

        let wordCount = this._getWordCount(doc);
        console.log("Word count: " + wordCount);

        let difficultWordCount = this._getDifficultWordCount(doc, "spache");
        console.log("Syllable count: " + difficultWordCount);

        // Calculate readability based on the Dale-Chall Readability Formula
        spacheRead = 0.659 + (0.121 * (wordCount / sentenceCount)) + (0.082 * ((difficultWordCount / wordCount) * 100));
        console.log("Calculated Spache Readability Formula score: " + spacheRead);

        return Math.round(spacheRead);
    }

    public _getWordCount(doc: TextDocument): number {

        let docContent = doc.getText();

        // Parse out unwanted whitespace so the split is accurate
        docContent = docContent.replace(/(< ([^>]+)<)/g, '').replace(/\s+/g, ' ');
        docContent = docContent.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
        let wordCount = 0;
        if (docContent != "") {
            wordCount = docContent.split(" ").length;
        }

        return wordCount;
    }
    
    public _getCharacterCount(doc: TextDocument): number {
        let docContent = doc.getText();

        // Strip all whitespace charactesr
        docContent = docContent.replace(/\s+/g, '');

        let charCount = 0;
        charCount = docContent.length;

        return charCount;
    }

    public _getSentenceCount(doc: TextDocument): number {
        let docContent = doc.getText();

        // Approximate sentence count by finding word, followed by punctuation (.?!) and whitespace or end of string
        let sentenceCount = 0;
        sentenceCount = docContent.match(/\w[.?!](\s|$)/g).length;

        // Return the count if more than zero sentences found, otherwise return 1
        return (sentenceCount > 0 ? sentenceCount : 1);
    }
    
    public _getSyllableCount(doc: TextDocument): number {
        var syllable = require('syllable');
        
        let docContent = doc.getText();
        let syllableCount = 0;

        syllableCount = syllable(docContent);

        return syllableCount;
    }

        
    public _getDifficultWordCount(doc: TextDocument, vocabulary: string): number {
        switch (vocabulary) {
            case "dale-chall":
                var familiarWords = require('dale-chall');
                break;
            case "spache":
                var familiarWords = require('spache');
                break;
            default:
                return 0;
        }
        
        let docContent = doc.getText();
        let difficultWordCount = 0;
        let wordList = Array();

        // Parse out unwanted whitespace so the split is accurate
        wordList = docContent.match(/\w/g);

        for (let word in wordList) {
            difficultWordCount += (familiarWords.indexOf(word) > -1) ? 1 : 0;
        }

        return difficultWordCount;
    }

    public _getPolysyllabicWordCount(doc: TextDocument): number {
        var syllable = require('syllable');
        
        let docContent = doc.getText();
        let polysyllabicWordCount = 0;
        let wordList = Array();

        // Parse out unwanted whitespace so the split is accurate
        wordList = docContent.match(/\w/g);

        for (let word in wordList) {
            polysyllabicWordCount += (syllable(word) >= 3 ) ? 1 : 0;
        }

        return polysyllabicWordCount;
    }

    dispose() {
        this._statusBarItem.dispose();
    }
}

class ReadabilityCheckController {

    private _readabilityCheck: ReadabilityCheck;
    private _disposable: Disposable;

    constructor(readabilityCheck: ReadabilityCheck) {
        this._readabilityCheck = readabilityCheck;

        // Update the readability counter when the file is opened or saved
        let subscriptions: Disposable[] = [];
        workspace.onDidOpenTextDocument(this._onEvent, this, subscriptions);
        workspace.onDidSaveTextDocument(this._onEvent, this, subscriptions);

        // Update the counter for the current file
        this._readabilityCheck.updateReadability();

        // Create a combined disposable from both event subscriptions
        this._disposable = Disposable.from(...subscriptions);
    }

    dispose() {
        this._disposable.dispose();
    }

    private _onEvent() {
        this._readabilityCheck.updateReadability();
    }
}