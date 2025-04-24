import jwt from 'jsonwebtoken';

const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, email: user.email },
        process.env.SECRET_KEY,
        { expiresIn: '7d' }
    );
};

export default generateToken;
