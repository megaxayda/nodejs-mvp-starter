import { Router, Request, Response } from 'express'
import isEmpty from 'lodash/isEmpty';
// import Joi from 'joi';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { errorLog } from 'util/logger';
import catchErrors from 'util/catchErrors'
// import { addAuditDate } from '../../mongo.js';
import User from 'model/user'
const SALT_ROUNDS = 10;

// const COLLECTION = 'users';
// const USERNAME_VALIDATE = Joi.string().min(5).max(100).required();
// const PASSWORD_VALIDATE = Joi.string().min(8).max(100).required();
// const FIRST_NAME_VALIDATE = Joi.string().min(1).max(30).required();
// const LAST_NAME_VALIDATE = Joi.string().min(1).max(30).required();
// const LEVEL_VALIDATE = Joi.number().min(1).max(10).required();

const addAuthRoute = async (router: Router) => {
    router.post('/login', loginHandler);
    router.post('/register', catchErrors(registerHandler));
};

const loginHandler = async (req: Request, res: Response): Promise<any> => {
    const body = req.body;

    const user = await User.findOne({ username: body.username }, 'password').exec()

    if (isEmpty(user)) {
        res.status(400).send({ msg: 'Wrong username or password' });
        return;
    }

    const passCorrect = await bcrypt.compare(body.password, user.password);

    if (passCorrect) {
        const token = await jwt.sign(
            {
                id: user.id,
                username: user.username,
            },
            process.env.SECRET || "123456789",
            { expiresIn: '30d' }
        );

        res.send({ token });
    } else {
        res.status(400).send({ msg: 'Wrong username or password' });
    }
};

const registerHandler = async (req: Request, res: Response) => {
    const body = req.body;

    if (body.adminPass !== process.env.ADMIN_PASSWORD) {
        res.status(400).send({ msg: '' });
        return;
    }

    const hash = await bcrypt.hash(body.password, SALT_ROUNDS);

    const user = new User({ ...body, password: hash });

    const result = await user.save()

    res.send({
        msg: 'success'
    });

    // } catch (err) {
    //     errorLog('getServicesHandler', err, res);
    //     res.status(500).send({ msg: 'Server Error' });
    // }
};

export default addAuthRoute;
