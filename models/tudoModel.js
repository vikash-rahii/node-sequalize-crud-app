module.exports = (sequelize, Sequelize) => {
    const Tutorial = sequelize.define("tutorial", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: Sequelize.STRING,
            // required: true
        },
        description: {
            type: Sequelize.STRING,
            //required: false
        },
        published: {
            type: Sequelize.BOOLEAN,
            //required: true
        }
    },
        { timestamp: true }
    );

    return Tutorial;
};