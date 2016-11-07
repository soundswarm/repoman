## Overview:
This react app:

31) takes your github username or organizationname

2) displays the corresponding list of repos that are not forks

3) let's you select a repo then displays this repo's files

4) let's you view the code in a file, highlight a word in this code, then search for this word across all this repo's files.  If this word is found, the file name and the code fragment containing the word are displayed.

The Github code-search API (https://developer.github.com/v3/search/#search-code) is used to search for a word across a repo's files. This doesn't return the exact location of the word in a file. Another function would have to written to find the exact location (e.g. line number and column) of the word in a file.


## To start project:
```
npm install
npm start
```

## To test project:
```
npm test
```