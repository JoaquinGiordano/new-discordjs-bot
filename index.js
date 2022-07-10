#!/usr/bin/env node
import chalk from 'chalk'
import inquirer from 'inquirer'
import { createSpinner } from 'nanospinner'
import { exec } from 'child_process'
import fs, { writeFileSync } from 'fs'

console.log(chalk.cyan('\nCreate Discord Bot'))

let { project_name, token } = await inquirer.prompt([
    {
        name: 'project_name',
        type: 'input',
        message: "Project's name:",
    },
    {
        name: 'token',
        type: 'input',
        message: "Bot's Token:",
    },
])

let spinner = createSpinner(
    'Cloning repository (https://github.com/JoaquinGiordano/discord-bot-boilerplate)'
).start()

await exec(
    `git clone https://github.com/JoaquinGiordano/discord-bot-boilerplate ${project_name
        .toLowerCase()
        .replaceAll(' ', '-')}`,
    async () => {
        spinner.success(
            'Repository Cloned (https://github.com/JoaquinGiordano/discord-bot-boilerplate)'
        )

        spinner = createSpinner('Setting up configs file').start()

        await fs.writeFile(
            `./${project_name.toLowerCase().replaceAll(' ', '-')}/config.json`,
            JSON.stringify({
                token,
            }),
            {},
            async () => {
                let packageJson = JSON.parse(
                    fs.readFileSync(
                        `./${project_name
                            .toLowerCase()
                            .replaceAll(' ', '-')}/package.json`
                    )
                )
                packageJson.name = project_name
                    .toLowerCase()
                    .replaceAll(' ', '-')
                packageJson.version = '1.0.0'
                packageJson.author = ''

                writeFileSync(
                    `./${project_name
                        .toLowerCase()
                        .replaceAll(' ', '-')}/package.json`,
                    JSON.stringify(packageJson)
                )
                spinner.success('Configs done')
                spinner = createSpinner('Installing dependencies').start()
                await exec(
                    `cd ${project_name
                        .toLowerCase()
                        .replaceAll(' ', '-')} && npm install`,
                    () => {
                        spinner.success('Dependencies installed')
                        console.log(
                            `\n${chalk.green(
                                'Project created'
                            )}\n\nStart developing your bot:\ncd ${project_name
                                .toLowerCase()
                                .replaceAll(
                                    ' ',
                                    '-'
                                )}\nnpm run dev\n\nGood Luck! 🍀`
                        )
                    }
                )
            }
        )
    }
)
