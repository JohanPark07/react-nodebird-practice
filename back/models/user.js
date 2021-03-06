module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        email:{
            type: DataTypes.STRING(30),
            allowNull: false, // 필수
            unique: true
        },
        nickname:{
            type: DataTypes.STRING(30),
            allowNull: false // 필수
        },
        password:{
            type: DataTypes.STRING(100),
            allowNull: false // 필수
        }
    },{
        charset: 'utf8',
        collate: 'utf8_general_ci'
    })
    User.associate = (db) => {
        db.User.hasMany(db.Post)
        db.User.hasMany(db.Comment)
        db.User.belongsToMany(db.Post,{through: 'like', as: 'Liked'})
        db.User.belongsToMany(db.User, {through:'Follow', as: 'Followers', foreignKey: 'FollowingId'})
        db.User.belongsToMany(db.User, {through:'Follow', as: 'Followings', foreignKey: 'FollowerId'})
    }
    return User;
}