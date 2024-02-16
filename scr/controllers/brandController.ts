import { Request, Response, NextFunction } from "express";
import Brand, { IBrand } from "../testing/brand";

interface RequestWithBrands extends Request {
  brands?: IBrand[];
}

interface RequestWithBrand extends Request {
  brand?: IBrand;
}

const index = async (
  req: RequestWithBrands,
  res: Response,
  next: NextFunction
) => {
  try {
    const brands = await Brand.find();
    res.json({ brands });
  } catch (error) {
    res.status(500).json({ message: "An error occurred" });
  }
};

const show = async (
  req: RequestWithBrand,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;
  try {
    const brand = await Brand.findById(id);
    if (!brand) {
      return res.status(404).json({ message: "Brand not found" });
    }
    res.json({ brand });
  } catch (error) {
    next(error);
  }
};

const store = async (req: Request, res: Response, next: NextFunction) => {
  const { name, destination, email, phoneNumber, age, description } = req.body;
  if (!name || !email) {
    return res.status(400).json({ message: "Name and email are required" });
  }

  try {
    const brand = new Brand({
      name,
      destination,
      email,
      phoneNumber,
      age,
      description,
    });
    if (req.file) {
      brand.avatar = req.file.path;
    }
    const savedBrand = await brand.save();
    res
      .status(201)
      .json({ message: "The brand was added successfully", brand: savedBrand });
  } catch (error) {
    res.status(500).json({ error: "Error on save the brand" });
  }
};

const update = async (req: Request, res: Response, next: NextFunction) => {
  const { name, destination, email, phoneNumber, age, description } = req.body;
  const brandId = req.params.id;
  try {
    const updatedBrand = await Brand.findByIdAndUpdate(
      brandId,
      { $set: { name, destination, email, phoneNumber, age, description } },
      { new: true }
    );
    if (!updatedBrand) {
      return res.status(404).json({ message: "Brand not found." });
    }
    res
      .status(200)
      .json({
        message: `The brand was updated successfully.`,
        brand: updatedBrand,
      });
  } catch (error) {
    next(error);
  }
};

const deleteBrand = async (req: Request, res: Response, next: NextFunction) => {
  const brandId = req.params.id;
  try {
    const deletedBrand = await Brand.findByIdAndDelete(brandId);
    if (!deletedBrand) {
      return res.status(404).json({ message: "Brand not found." });
    }
    res.status(200).json({ message: `The brand was deleted successfully.` });
  } catch (error) {
    next(error);
  }
};

export { index, show, store, update, deleteBrand };
