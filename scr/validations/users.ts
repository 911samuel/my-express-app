import { z, ZodError } from 'zod';
import { hash } from 'bcryptjs';
import { IUser } from '../models/users';

const userZodSchema = z.object({
  firstname: z.string().min(1, { message: 'First name is required' }),
  lastname: z.string().min(1, { message: 'Last name is required' }),
  username: z.string().min(1, { message: 'Username is required' }),
  email: z.string().email({ message: 'Invalid email format' }).min(1, { message: 'Email is required' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
  role: z.string().min(5).default('USER'),
  profile: z.any().optional()
});

interface ValidatedUser extends Omit<IUser, 'password'> {}

const validateUser = async (userData: any): Promise<ValidatedUser | { validationErrors: Record<string, string> }> => {
  try {
    const validatedData: any = userZodSchema.parse(userData);

    if (validatedData.password) {
      const hashedPassword = await hash(validatedData.password, 10);
      validatedData.password = hashedPassword;
    }

    return validatedData;
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

const updateUserSchema = z.object({
  firstname: z.string().min(1, { message: 'First name is required' }).optional(),
  lastname: z.string().min(1, { message: 'Last name is required' }).optional(),
  username: z.string().min(1, { message: 'Username is required' }).optional(),
  email: z.string().email({ message: 'Invalid email format' }).min(1, { message: 'Email is required' }).optional(),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long' }).optional(),
  role: z.string().min(5).optional(),
  profile: z.any().optional()
});

const validateupdatedUser = async (userData: any): Promise<ValidatedUser | { validationErrors: Record<string, string> }> => {
  try {
    const validatedData: any = updateUserSchema.parse(userData);

    if (validatedData.password) {
      const hashedPassword = await hash(validatedData.password, 10);
      validatedData.password = hashedPassword;
    }

    return validatedData;
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

export { validateUser, validateupdatedUser };
