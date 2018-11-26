const fs = require('fs');
const path = require('path');
const doctrine = require('doctrine');
const jsYaml = require('js-yaml');

function parseRegexResults(regexResults) {
  const matches = [];
  if (regexResults) {
    for (let i = 0; i < regexResults.length; i += 1) {
      const match = doctrine.parse(regexResults[i], {
        unwrap: true,
      });
      matches.push(match);
    }
  }
  return matches;
}

/**
 * Parses the provided API file for JSDoc comments.
 * @function
 * @param {string} file - File to be parsed
 * @returns {{jsdoc: array, yaml: array}} JSDoc comments and Yaml files
 * @requires doctrine
 */
function parseApiFile(file) {
  // eslint-disable-next-line
  const jsDocRegex = /\/\*\*([\s\S]*?)\*\//gm;
  // eslint-disable-next-line
  const csDocRegex = /\#\#\#([\s\S]*?)\#\#\#/gm;
  const fileContent = fs.readFileSync(file, { encoding: 'utf8' });
  const ext = path.extname(file);
  const yaml = [];
  let jsDocComments = [];

  switch (ext) {
    case '.yml':
    case '.yaml':
      yaml.push(jsYaml.safeLoad(fileContent));
      break;

    case '.coffee':
      jsDocComments = parseRegexResults(fileContent.match(csDocRegex));
      break;

    default: {
      jsDocComments = parseRegexResults(fileContent.match(jsDocRegex));
    }
  }

  return {
    yaml,
    jsdoc: jsDocComments,
  };
}

module.exports = parseApiFile;
