import { Request, Response, NextFunction } from 'express'
import { MongoError } from 'mongodb'
import get from 'lodash/get'
import chalk from 'chalk'

const catchErrors = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
    return fn(req, res, next).catch(
        (err: Error | MongoError) => {
            // console.log(err)
            if (get(err, 'code') === 11000) {
                res.status(400).send({ msg: 'Duplicated code' });
                return;
            }

            const trackId = (new Date()).toString();
            console.group();
            console.error(chalk.red('START: ' + trackId));
            console.error(err);
            console.error(chalk.red('END: ' + trackId));
            console.groupEnd();
            return next
        })
}

export default catchErrors