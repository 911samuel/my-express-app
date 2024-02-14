import { Request, Response, NextFunction } from 'express';
import Brand, { IBrand } from '../testing/brand';

interface RequestWithBrands extends Request {
    brands?: IBrand[];
}

interface RequestWithBrand extends Request {
    brand?: IBrand;
}

const index = (req: RequestWithBrands, res: Response, next: NextFunction) => {
    Brand.find(function (err: Error, brands: IBrand[]) {
        if (err) return next(err);
        req.brands = brands;
        next();
    });
};

const show = (req: RequestWithBrand, res: Response, next: NextFunction) => {
    let id = req.body.id || req.params.id;
    Brand.findById(id, function (err: Error, brand: IBrand | null) {
        if (err) return next(err);
        if (!brand) {
            return res.status(404).json({ message: 'Brand not found' });
        }
        req.brand = brand;
        next();
    });
};

const store = (req: Request, res: Response, next: NextFunction) => {
    let brand = new Brand({
        name: req.body.name,
        destination: req.body.destination,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        age: req.body.age,
        description: req.body.description
    });
    brand.save()
    .then((data: any) => {
        res.status(201).json(data);
    })
    .catch((error: Error) => {
        res.status(500).json({ error: "Error on save the brand"});
    });
};


const update = (req: Request, res: Response, next: NextFunction) => {
    let brandId = req.body.brandId;
    let updateData = {
        name: req.body.name,
        destination: req.body.destination,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        age: req.body.age,
        description: req.body.description
    };
    Brand.findByIdAndUpdate(brandId, { $set: updateData }, { new: true })
        .then(data => {
            if (!data) {
                return res.status(404).json({ message: 'Brand not found.' });
            } else {
                res.status(200).json(data);
            }
        }).catch(next);
};

const deleteBrand = (req: Request, res: Response, next: NextFunction) => {
    let brandId = req.params.id;
    Brand.findByIdAndDelete(brandId, function (err: Error | null, brandDeleted: IBrand | null) {
        if (err) return next(err);
        if (!brandDeleted) {
            return res.status(404).json({ message: 'Brand not found' });
        }
        res.status(200).json({ message: 'Brand deleted successfully' });
    });
};

export { index, show, store, update, deleteBrand };
