const { Smartphone } = require("../models");

exports.getAll = async (req, res) => {
	try {
		const smartphones = await Smartphone.findAll();
		console.log(smartphones);
		res.status(200).json(smartphones);
	} catch (error) {
		console.error(error);
		res.status(500).send({ message: "Error retrieving smartphones" });
	}
};

exports.getById = async (req, res) => {
	const { id } = req.params;

	try {
		const smartphone = await Smartphone.findByPk(id);
		if (!smartphone) {
			return res.status(404).json({ message: "Smartphone not found" });
		}

		res.status(200).json(smartphone);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Server error" });
	}
};

exports.create = async (req, res) => {
	const { name, model, brand, price, color } = req.body;

	try {
		const existingSmartphone = await Smartphone.findOne({ where: { name } });

		if (existingSmartphone) {
			return res.status(400).json({
				message: `The smartphone '${name}' is already registered.`,
			});
		}

		const newSmartphone = await Smartphone.create({ name, model, brand, price, color });

		res.status(200).json(newSmartphone);
	} catch (error) {
		console.error(error);
		res.status(500).send({ message: "Error retrieving smartphones" });
	}
};

exports.update = async (req, res) => {
	const { id } = req.params;
	const { name, brand, model, price, color } = req.body;

	try {
		const smartphone = await Smartphone.findByPk(id);
		if (!smartphone) {
			return res.status(404).json({ message: "Smartphone not found" });
		}

		await smartphone.update({
			name: name || smartphone.name,
			brand: brand || smartphone.brand,
			model: model || smartphone.model,
			price: price || smartphone.price,
			color: color || smartphone.color,
		});

		res.status(200).json({ message: "Smartphone updated successfully" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Server error" });
	}
};

exports.delete = async (req, res) => {
	const { id } = req.params;
	try {
        const smartphone = await Smartphone.findByPk(id);
		if (!smartphone) {
			return res.status(404).json({ message: "Smartphone not found" });
		}

		await smartphone.destroy();

		res.status(200).json({ message: "Smartphone deleted successfully" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Server error" });
	}
};
