import { Request, Response, NextFunction } from "express";
import Brand, { IBrand } from "../models/brand";
import { validationResult } from "express-validator";

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
    console.error("Error fetching brands:", error);
    res.status(500).json({ error: "An error occurred while fetching brands", details: error});
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
    console.error("Error fetching brand:", error);
    next(error);
  }
};

const store = async (req: Request, res: Response, next: NextFunction) => {
  const { title, author, category, description } = req.body;
  const errors = validationResult(req.body);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const brand = new Brand({
      title,
      author,
      category,
      description,
      avatar: req.file?.path,
    });
    const savedBrand = await brand.save();
    res
      .status(201)
      .json({ message: "The brand was added successfully"});
  } catch (error) {
    console.error("Error saving brand:", error);
    res.status(500).json({ error: "Error on save the brand" });
  }
};

const update = async (req: Request, res: Response, next: NextFunction) => {
  const { title, author, category, description } = req.body;
  const brandId = req.params.id;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const updatedBrand = await Brand.findByIdAndUpdate(
      brandId,
      { $set: { title, author, category, description } },
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
    console.error("Error updating brand:", error);
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
    console.error("Error deleting brand:", error);
    next(error);
  }
};

const deleteAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await Brand.deleteMany({});
    res.status(200).json({ message: `All brands were deleted successfully.` });
  } catch (error) {
    console.error("Error deleting all brands:", error);
    next(error);
  }
};

export { index, show, store, update, deleteBrand, deleteAll };
