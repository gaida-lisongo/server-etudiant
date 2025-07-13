// Generate token for user authentication
import jwt from 'jsonwebtoken';

export const generateToken = (user) => {
    const token = jwt.sign(
        {
            id: user.id,
            matricule: user.matricule,
            nom: user.nom,
            prenom: user.prenom,
            sexe: user.sexe
        },
        process.env.JWT_SECRET,
        {
        expiresIn: '30d', // Token expiration time
        }
    );
    return token;
    }

// middle check if user is authenticated
export const isAuthenticated = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        req.user = decoded;
        next();
    });
};
