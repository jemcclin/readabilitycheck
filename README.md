# ReadabilityCheck

This extension provides a quick-and-easy display of the readability score of text in plain text or Markdown files when a file is opened or saved, or when the "Check readability" command is run (Ctrl + Shift + P, "Check readability").

## Features
Currently supported readability score formulas include:
* Automated Readability Index
* Coleman-Liau Index
* Dale-Chall Readability Formula
* Flesch Reading Ease
* Flesch-Kincaid Grade Level
* Simple Measure of Gobbledygook (SMOG) Formula

Currently supported languages include:
* Plain text files
* Markdown

Future plans for this extension include highlighting the text based on readability score values (eg: long sentences, difficult paragraphs, challenging words, etc.) to make it easier to see where the text could be revised.

### Automated Readability Index
Text is reviewed using the [Automated Readability Index](https://en.wikipedia.org/wiki/Automated_readability_index) formula, and calculates the approximate US grade level needed to understand the text, based roughly on the length of words in the document and the number of words per sentence.

The returned score can be from 1 to 14, and will generally represent the grade level required to understand the text. More specifically:

| Score | Age | Grade Level |
| --- | --- | --- |
| 1	| 5-6 | Kindergarten |
| 2	| 6-7 | 1st grade |
| 3	| 7-8 | 2nd grade |
| 4	| 8-9 | 3rd grade | 
| 5	| 9-10 | 4th grade |
| 6	| 10-11 | 5th grade |
| 7	| 11-12 | 6th grade |
| 8	| 12-13 | 7th grade |
| 9	| 13-14 | 8th grade |
| 10 | 14-15 | 9th grade |
| 11 | 15-16 | 10th grade |
| 12 | 16-17 | 11th grade |
| 13 | 17-18 | 12th grade |
| 14 | 18-22 | College |

### Coleman-Liau Index
Text is reviewed using the [Coleman-Liau index](https://en.wikipedia.org/wiki/Coleman%E2%80%93Liau_index), which calculates the approximate US grade level needed to understand the text. The Coleman-Liau index relies on characters instead of syllables per word, much like the Automated Readability Index.

The returned score is an integer above 1, and will generally represent the grade level required to understand the text, with level 14 and above being suitable for a college student.

| Score | Grade Level |
| --- | --- |
| 1 - 9 | Elementary school |
| 10 - 13 | High school |
| 14+ | College |

### Dale-Chall Readability Formula
Using the [Dale-Chall Readability Formula]([https://en.wikipedia.org/wiki/Dale%E2%80%93Chall_readability_formula), the text is checked against a list of 3,000 words that fourth-grade American students should be able to reliably understand, and any words in the text that are not on that list are marked "difficult." The final score is generated taking into account the percentage of difficult words in the text and the number of long sentences.

The final score can be any number below 9.9, and corresponds roughly to the following grade levels:

| Score | Grade Level |
| --- | --- |
| below 4.9 | 4th grade or lower |
| 5.0 to 5.9 | 5th or 6th grade |
| 6.0 to 6.9 | 7th or 8th grade |
| 7.0 to 7.9 | 9th or 10th grade |
| 8.0 to 8.9 | 11th or 12th grade |
| 9.0 to 9.9 | College |

The familiar words list is provided by the [dale-chall](https://github.com/words/dale-chall) library released under MIT license by [Titus Wormer](https://github.com/wooorm).

### Flesch Reading Ease
Using the [Flesch Reading Ease](https://en.wikipedia.org/wiki/Flesch%E2%80%93Kincaid_readability_tests#Flesch_Reading_Ease) formula, the text's readability score is generated in part based on the average number of words in sentences, and the average number of syllables in the words.

The returned score can be from negative numbers to 120. These can be roughly approximated to the following grade levels:

| Reading Ease Score | Grade Level | Notes |
| --- | --- | --- |
| 90 - 100+ | 5th grade | Very easy to read |
| 80 - 90 | 6th grade | Easy to read |
| 70 - 80 | 7th grade | Fairly easy to read |
| 60 - 70 | 8th/9th grade | Plain english |
| 50 - 60 | 10th-12th grade | Fairly difficult to read |
| 30 - 50 | College | Difficult to read |
| 0 - 30 | College graduate | Very difficult to read |
| Negative numbers | Advanced degree | Extremely difficult to read |

The syllable count is generated using the [syllable](https://github.com/words/syllable) library released under MIT license by [Titus Wormer](https://github.com/wooorm).

### Flesch-Kincaid Grade Level
The score is calculated using the [Flesch-Kincaid grade level](https://en.wikipedia.org/wiki/Flesch%E2%80%93Kincaid_readability_tests#Flesch%E2%80%93Kincaid_grade_level), which determines readability based on the average number of words in sentences, and the average number of syllables in the words. That score is then translated into the approximate grade level required to understand the text.

The returned score is the approximate grade level required to understand the text; or, the number of years of education required to understand the text (especially when the formula returns a number higher than 10). Negative numbers are possible, but usually indicate the text is very easy to read.

The syllable count is generated using the [syllable](https://github.com/words/syllable) library released under MIT license by [Titus Wormer](https://github.com/wooorm).

### Simple Measure of Gobbledygook (SMOG) Formula
The [SMOG Formula](https://en.wikipedia.org/wiki/SMOG) uses the number of sentences and the number of polysyllabic words in the text to generate the approximate number of years of education needed to understand the text.

The syllable count is generated using the [syllable](https://github.com/words/syllable) library released under MIT license by [Titus Wormer](https://github.com/wooorm).

### Spache Readability Formula
Using the [Spache Readability Formula]([https://en.wikipedia.org/wiki/Spache_readability_formula), the text is checked against a set list of everyday words, and any words in the text that are not on that list are marked "difficult." The final score is generated taking into account the percentage of difficult words in the text and the average sentence length.

The score returned by the formula will reflect the approximate grade level that should be able to understand the text.

The Spache readability formula is best used on texts that are targeted to younger audiences (children in or below 4th grade). For older audiences, the Dale-Chall formula will generally work better.

The familiar words list is provided by the [spache](https://github.com/words/spache) library released under MIT license by [Titus Wormer](https://github.com/wooorm).

## Extension Settings

This extension supports the following settings:

* `readabilityCheck.formula`: determines which algorithm to use for scoring

Score can be any of the below options:
* `automated-readability`, for the Automated Readability Index score (default)
* `flesch`, for Flesch Readability Ease
* `flesch-kincaid`, for the Flesch-Kincaid US Grade Level
* `coleman-liau`, for the Coleman-Liau Index
* `dale-chall`, for the Dale-Chall Readability Formula
* `smog`, for the Simple Measure of Gobbledygook (SMOG) Formula
* `sprache`, for the Sprache Readability Formula

If unset, the extension will default to `automated-readability`.

## Known Issues

For heavily-marked up Markdown documents, or documents with a lot of tables/lists, the scores may be in the "difficult" range unnecessarily due to the sentence detection expression not picking up "end of line" as an end of a sentence in cases where there is no terminating punctuation (eg: list entries).

## Release Notes

### 1.0.0

Initial release of ReadabilityCheck

### 1.1.0

Add Markdown format stripping to make the wordcount/character counts more accurate, to improve score accuracy.

## License
This extension is released under the MIT license.

This extension references the following packages released under the MIT license: 
* [syllable](https://github.com/words/syllable), developed by [Titus Wormer](http://wooorm.com/)
* [dale-chall](https://github.com/words/dale-chall), developed by [Titus Wormer](http://wooorm.com/)
* [spache](https://github.com/words/spache), developed by [Titus Wormer](http://wooorm.com/)
* [remove-markdown](https://github.com/stiang/remove-markdown), developed by [Stian Grytøyr](https://github.com/stiang)
