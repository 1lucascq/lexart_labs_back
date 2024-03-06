module.exports = (sequelize, DataTypes) => {
	const User = sequelize.define("User", {
		username: {
			type: DataTypes.STRING,
			unique: true,
			allowNull: false,
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	});

	return User;
};

// INSERT INTO smartphones (name, brand, model, price, color) VALUES
// ('iPhone 13 Pro', 'Apple', '13 Pro', 999.00, 'Graphite'),
// ('Samsung Galaxy S21 Ultra', 'Samsung', 'Galaxy S21 Ultra', 1199.99, 'Phantom Black'),
// ('Google Pixel 6 Pro', 'Google', 'Pixel 6 Pro', 899.00, 'Stormy Black'),
// ('OnePlus 9 Pro', 'OnePlus', '9 Pro', 969.00, 'Morning Mist'),
// ('Xiaomi Mi 11', 'Xiaomi', 'Mi 11', 699.99, 'Midnight Gray'),
// ('Sony Xperia 1 III', 'Sony', 'Xperia 1 III', 1299.99, 'Frosted Purple');