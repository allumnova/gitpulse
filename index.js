#!/usr/bin/env node
require('dotenv').config();
const { Command } = require('commander');
const chalk = require('chalk');
const program = new Command();

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

if (!GITHUB_TOKEN) {
    console.error(chalk.red('Error: GITHUB_TOKEN not found in .env file'));
    process.exit(1);
}

const headers = {
    'Authorization': `token ${GITHUB_TOKEN}`,
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'GitPulse-CLI'
};

async function getStats() {
    console.log(chalk.cyan('\n💓 Fetching your GitHub pulse...'));

    try {
        const userRes = await fetch('https://api.github.com/user', { headers });
        const user = await userRes.json();

        const reposRes = await fetch('https://api.github.com/user/repos?sort=updated', { headers });
        const repos = await reposRes.json();

        console.log(chalk.bold(`\n--- ${user.login}'s Pulse ---`));
        console.log(`${chalk.yellow('Public Repos:')} ${user.public_repos}`);
        console.log(`${chalk.yellow('Followers:')}    ${user.followers}`);
        console.log(`${chalk.yellow('Following:')}    ${user.following}`);

        console.log(chalk.bold('\n--- Recent Activity (Latest Repos) ---'));
        repos.slice(0, 5).forEach(repo => {
            console.log(`${chalk.green('✔')} ${chalk.white(repo.name)} - ${chalk.dim(repo.description || 'No description')}`);
        });

        console.log(chalk.blue('\nStay active! Keep the pulse going. 🚀'));

    } catch (error) {
        console.error(chalk.red('Request failed:'), error.message);
    }
}

program
    .name('gitpulse')
    .description('A sleek CLI to check your GitHub activity pulse')
    .version('1.0.0');

program
    .command('check')
    .description('Check your GitHub activity pulse')
    .action(getStats);

program.parse();
