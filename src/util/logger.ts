/* eslint-disable no-unused-vars */
import { Response } from 'express';
import chalk from 'chalk';

export const errorLog = (name: string, err: Error, res: Response) => {
    const trackId = (new Date()).toString();
    console.group();
    console.error(chalk.red('START: ' + trackId, name, err));
    console.error(err);
    console.error(chalk.red('END: ' + trackId, name, err));
    console.groupEnd();
    res.status(500).send({ msg: 'Server Error', trackId });
};
