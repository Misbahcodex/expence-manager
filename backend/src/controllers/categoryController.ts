import { Request, Response } from 'express';
import { CategoryModel } from '../models/Category-mongo';

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await CategoryModel.findAll();
    
    // Transform MongoDB _id to id for frontend compatibility
    const transformedCategories = categories.map(category => ({
      id: (category._id as any).toString(),
      name: category.name,
      type: category.type,
      created_at: category.created_at
    }));
    
    res.json(transformedCategories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};
