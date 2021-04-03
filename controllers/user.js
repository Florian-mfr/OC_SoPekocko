const bcrypt = require('bcrypt');
const User = require('../models/user')
const jwt = require('jsonwebtoken');

exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};
function replaceWithStars(str){
    return str.split('').map( (letter, index) => {
        if(index >= str.length/2){
            return "*"
        } else {
            return letter
        }
    }).join('')
} 
function maskEmail(email){
    let emailPart1 = email.split('@')
    let emailPart2 = emailPart1[1].split('.')
    return `${replaceWithStars(emailPart1[0])}@${replaceWithStars(emailPart2[0])}.${replaceWithStars(emailPart2[1])}`
}

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect !' });
                    }
                    const email = maskEmail(req.body.email);
                    res.status(200).json({
                        userId: user._id,
                        email,
                        token: jwt.sign(
                            { userId: user._id },
                            process.env.JWT_PASSWORD,
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};