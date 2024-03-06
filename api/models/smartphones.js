module.exports = (sequelize, DataTypes) => {
	const Smartphone = sequelize.define("Smartphone", {
		name: {
			type: DataTypes.STRING,
			unique: true,
			allowNull: false,
		},
		model: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		price: {
			type: DataTypes.FLOAT,
			allowNull: false,
		},
		color: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		brand: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	});

	return Smartphone;
};
