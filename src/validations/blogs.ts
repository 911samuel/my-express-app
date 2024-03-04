import { z, ZodError } from 'zod';
import { Response } from 'express';
import { IBlog } from '../models/blogs';

const blogsZodSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  author: z.string().min(1, { message: 'Author is required' }), 
  imgUrl: z.string().min(1, { message: 'Image path is required' }),  
});

const updateBlogSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }).optional(),
  text: z.string().min(1, { message: 'Text is required' }).optional(),
  imagePath: z.string().min(1, { message: 'Image path is required' }).optional(),  
});

interface UpdatedBlog extends IBlog {}

const validateBlog = async (articleData: any, res: Response): Promise<UpdatedBlog | { validationErrors: Record<string, string> }>  => {
  try {
    const validatedData = blogsZodSchema.parse(articleData);
    return validatedData as UpdatedBlog;
  } catch (error) {
    if (error instanceof ZodError) {
      console.error('Validation failed:', error.errors);

      const errorMessages: Record<string, string> = {};
      error.errors.forEach((validationError) => {
        const fieldName = validationError.path[0];
        const errorMessage = validationError.message;
        errorMessages[fieldName] = errorMessage;
      });

      return { validationErrors: errorMessages };
    } else {
      console.error('Unexpected error:', error);
      return { validationErrors: { unexpected: 'Unexpected error occurred' } };
    } 
  }
};

const validateUpdatedBlog = async (articleData: any, res: Response): Promise<UpdatedBlog | { validationErrors: Record<string, string> }>  => {
  try {
    const validatedData = updateBlogSchema.parse(articleData);
    return validatedData as UpdatedBlog;
  } catch (error) {
    if (error instanceof ZodError) {
      console.error('Validation failed:', error.errors);

      const errorMessages: Record<string, string> = {};
      error.errors.forEach((validationError) => {
        const fieldName = validationError.path[0];
        const errorMessage = validationError.message;
        errorMessages[fieldName] = errorMessage;
      });

      return { validationErrors: errorMessages };
    } else {
      console.error('Unexpected error:', error);
      return { validationErrors: { unexpected: 'Unexpected error occurred' } };
    }
  }
};

export { validateBlog, validateUpdatedBlog };
