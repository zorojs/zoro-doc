const debug = require('debug')('zoro-doc');
const Command = require('./command');
const cosmiconfig = require('cosmiconfig');
const globby = require('globby');
const bluebird = require('bluebird');
const matter = require('gray-matter');
const fs = require('fs-extra');
const path = require('path');
const _ = require('lodash');

const cwd = process.cwd();

class MainCommand extends Command {
  constructor() {
    super();
    this.usage = `Usage: ${this.name} [options]`;
  }

  async run({ argv }) {
    this.argv = argv;
    await this.getConfig();
    await this.getMarkdowns();
  }

  async getConfig() {
    this.config = {};
    const result = await cosmiconfig(this.name).load();
    if (result) {
      const { config, filepath } = result;
      debug(`load config from ${filepath}`);
      Object.assign(this.config, config);
    }
  }

  async getMarkdowns() {
    const {
      groupPath = [],
      files: moreMarkdownPaths,
      concurrency
    } = this.config;

    // create all groups
    this.markdownMap = {
      group: {}
    };
    let group = this.markdownMap.group;
    groupPath.forEach(k => {
      group[k] = group[k] || {};
      group[k].list = group[k].list || [];
      group = group[k];
    });
    console.log(JSON.stringify(this.markdownMap.group, null, 4));

    // collect all markdown paths
    let markdownPaths = await globby(['src/**/*.md']);
    if (moreMarkdownPaths) {
      markdownPaths.push(...moreMarkdownPaths.filter(this.util.isMarkdown));
    }
    markdownPaths = _.uniq(markdownPaths);

    // read files
    await bluebird.map(
      markdownPaths,
      markdownPath => {
        this.readMarkdown(markdownPath);
      },
      {
        concurrency: parseInt(concurrency, 10) || 5
      }
    );
  }

  readMarkdown(markdownPath) {
    const absolutePath = path.resolve(cwd, markdownPath);
    const relativePath = path.relative(cwd, absolutePath);
    return fs.readFile(absolutePath).then(file => {
      const { data, content } = matter(file);
      if (Object.keys(data).length) {
        debug(`got file ${markdownPath}`);
        const markdown = Object.assign({ absolutePath, relativePath }, data, {
          content
        });
        // store markdown
        this.markdownMap[markdownPath] = markdown;
        // push to group
        // this.groupIds.forEach(id => {
        //   if (markdownPath[id]) {
        //     if (!this.markdownMap.group[id]) {
        //       this.markdownMap.group[id] = {};
        //     }
        //     this.markdownMap.group.push(markdown);
        //   }
        // });
      } else {
        debug(`ignore file ${markdownPath}`);
      }
    });
  }

  get name() {
    return 'zoro-doc';
  }
}

module.exports = MainCommand;
