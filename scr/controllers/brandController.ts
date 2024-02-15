import { Request, Response, NextFunction } from 'express';
import Brand, { IBrand } from '../testing/brand';

interface RequestWithBrands extends Request {
    brands?: IBrand[];
}

interface RequestWithBrand extends Request {
    brand?: IBrand;
}

const index = (req: RequestWithBrands, res: Response, next: NextFunction) => {
    Brand.find()
        .then((response: IBrand[]) => {
            res.json({ response });
        })
        .catch((error: Error) => {
            res.status(500).json({ message: "An error occurred" });
        });
};

const show = (req: RequestWithBrand, res: Response, next: NextFunction) => {
    const id = req.params.id;
    Brand.findById(id)
        .then((brand: IBrand | null) => {
            if (!brand) {
                return res.status(404).json({ message: 'Brand not found' });
            }
            res.json({ brand });
        })
        .catch((error: Error) => {
            next(error);
        });
};

const store = (req: Request, res: Response, next: NextFunction) => {
    const brand = new Brand({
        name: req.body.name,
        destination: req.body.destination,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        age: req.body.age,
        description: req.body.description
    });

    if (req.file) {
        brand.avatar = req.file.path;
    }

    brand.save()
        .then((savedBrand: IBrand) => {
            res.status(201).json({ message: `The brand was added successfully.`, brand: savedBrand });
        })
        .catch((error: Error) => {
            res.status(500).json({ error: "Error on save the brand" });
        });
};

const update = (req: Request, res: Response, next: NextFunction) => {
    const brandId = req.params.id;
    const updateData = {
        name: req.body.name,
        destination: req.body.destination,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        age: req.body.age,
        description: req.body.description
    };
    Brand.findByIdAndUpdate(brandId, { $set: updateData }, { new: true })
        .then((updatedBrand: IBrand | null) => {
            if (!updatedBrand) {
                return res.status(404).json({ message: 'Brand not found.' });
            }
            res.status(200).json({ message: `The brand was updated successfully.`, brand: updatedBrand });
        })
        .catch((error: Error) => {
            next(error);
        });
};

const deleteBrand = (req: Request, res: Response, next: NextFunction) => {
    const brandId = req.params.id;
    Brand.findByIdAndDelete(brandId)
        .then((deletedBrand: IBrand | null) => {
            if (!deletedBrand) {
                return res.status(404).json({ message: 'Brand not found.' });
            }
            res.status(200).json({ message: `The brand was deleted successfully.` });
        })
        .catch((error: Error) => {
            next(error);
        });
};

export { index, show, store, update, deleteBrand };