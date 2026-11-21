import { supabase } from '../lib/supabaseClient';

/**
 * Fallback placeholder image when an item doesn't have an image
 */
export const DEFAULT_PRODUCT_IMAGE =
  'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=800&q=80';

/**
 * Returns a publicly accessible URL for a product image stored in Supabase Storage.
 * Handles both relative storage paths (e.g. "uuid/timestamp-photo.jpg") and external URLs.
 * 
 * @param {string|null} imagePath
 * @returns {string}
 */
export const getListingImageUrl = (imagePath) => {
  if (!imagePath || typeof imagePath !== 'string') {
    return DEFAULT_PRODUCT_IMAGE;
  }

  // If already an absolute http/https URL, return directly
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  // Retrieve public URL from Supabase Storage 'product-images' bucket
  const { data } = supabase.storage.from('product-images').getPublicUrl(imagePath);
  return data?.publicUrl || DEFAULT_PRODUCT_IMAGE;
};

/**
 * Normalizes a raw Supabase listing row into a clean frontend product object
 * compatible with ProductCard and ProductDetails components.
 * 
 * @param {Object} row - Row from listings table joined with profiles
 * @returns {Object}
 */
export const normalizeListing = (row) => {
  if (!row) return null;

  const sellerProfile = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;

  return {
    id: row.id,
    name: row.title || 'Untitled Listing',
    title: row.title || 'Untitled Listing',
    price: Number(row.price) || 0,
    category: row.category || 'Others',
    condition: row.condition || 'Good',
    description: row.description || '',
    image_path: row.image_path || null,
    image: getListingImageUrl(row.image_path),
    status: row.status || 'available',
    seller_id: row.seller_id,
    created_at: row.created_at,
    seller: {
      name: sellerProfile?.full_name || 'NITJ Student',
      email: sellerProfile?.college_email || 'student@nitj.ac.in',
    },
  };
};

/**
 * Fetch all available listings for the campus marketplace.
 * Supports optional category filtering.
 * 
 * @param {string} [category='All']
 * @returns {Promise<{ data: Array, error: Error|null }>}
 */
export const getAvailableListings = async (category = 'All') => {
  try {
    let query = supabase
      .from('listings')
      .select('*, profiles:seller_id(id, full_name, college_email)')
      .eq('status', 'available')
      .order('created_at', { ascending: false });

    if (category && category !== 'All') {
      query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) {
      // If the foreign key join failed due to syntax or relationship naming, fallback to basic select
      console.warn('Joined query warning, falling back to direct listings fetch:', error.message);
      const fallbackQuery = supabase
        .from('listings')
        .select('*')
        .eq('status', 'available')
        .order('created_at', { ascending: false });

      if (category && category !== 'All') {
        fallbackQuery.eq('category', category);
      }

      const fallbackResult = await fallbackQuery;
      if (fallbackResult.error) {
        return { data: [], error: fallbackResult.error };
      }

      const normalized = (fallbackResult.data || []).map(normalizeListing);
      return { data: normalized, error: null };
    }

    const normalized = (data || []).map(normalizeListing);
    return { data: normalized, error: null };
  } catch (err) {
    return { data: [], error: err instanceof Error ? err : new Error(String(err)) };
  }
};

/**
 * Fetch a single product listing by its ID, along with the seller's profile.
 * 
 * @param {string|number} id
 * @returns {Promise<{ data: Object|null, error: Error|null }>}
 */
export const getListingById = async (id) => {
  try {
    if (!id) {
      return { data: null, error: new Error('Listing ID is required.') };
    }

    // Attempt joined query
    const { data, error } = await supabase
      .from('listings')
      .select('*, profiles:seller_id(id, full_name, college_email)')
      .eq('id', id)
      .single();

    if (error) {
      // Fallback: try fetching without join, then fetch profile separately
      const fallback = await supabase
        .from('listings')
        .select('*')
        .eq('id', id)
        .single();

      if (fallback.error || !fallback.data) {
        return { data: null, error: fallback.error || error };
      }

      let sellerProfile = null;
      if (fallback.data.seller_id) {
        const { data: prof } = await supabase
          .from('profiles')
          .select('id, full_name, college_email')
          .eq('id', fallback.data.seller_id)
          .single();
        sellerProfile = prof;
      }

      const normalized = normalizeListing({
        ...fallback.data,
        profiles: sellerProfile,
      });

      return { data: normalized, error: null };
    }

    return { data: normalizeListing(data), error: null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err : new Error(String(err)) };
  }
};

/**
 * Fetch all listings created by a specific user (for My Listings page).
 * 
 * @param {string} userId - UUID of the logged-in user
 * @returns {Promise<{ data: Array, error: Error|null }>}
 */
export const getUserListings = async (userId) => {
  try {
    if (!userId) {
      return { data: [], error: new Error('User ID is required to fetch user listings.') };
    }

    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .eq('seller_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      return { data: [], error };
    }

    const normalized = (data || []).map((row) => normalizeListing(row));
    return { data: normalized, error: null };
  } catch (err) {
    return { data: [], error: err instanceof Error ? err : new Error(String(err)) };
  }
};

/**
 * Upload an image file to the `product-images` Supabase Storage bucket
 * under a folder named with the user's UUID: `${userId}/${timestamp}-${filename}`.
 * 
 * @param {File} file
 * @param {string} userId
 * @returns {Promise<{ path: string|null, error: Error|null }>}
 */
export const uploadProductImage = async (file, userId) => {
  try {
    if (!file || !userId) {
      return { path: null, error: new Error('Image file and user ID are required.') };
    }

    // Sanitize file name: remove non-alphanumeric characters except dots/hyphens
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filePath = `${userId}/${Date.now()}-${cleanFileName}`;

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      return { path: null, error: uploadError };
    }

    return { path: filePath, error: null };
  } catch (err) {
    return { path: null, error: err instanceof Error ? err : new Error(String(err)) };
  }
};

/**
 * Create a new product listing in the `listings` table and upload its image to storage.
 * 
 * @param {Object} params
 * @param {string} params.title - Product title / name
 * @param {string} params.description - Detailed description
 * @param {number|string} params.price - Price in INR
 * @param {string} params.category - Item category (Books, Electronics, etc.)
 * @param {string} params.condition - Condition (Like New, Good, Fair)
 * @param {File} [params.imageFile] - Selected image file
 * @param {string} params.userId - Authenticated user UUID (for seller_id and storage path)
 * @returns {Promise<{ data: Object|null, error: Error|null }>}
 */
export const createListing = async ({
  title,
  description,
  price,
  category,
  condition,
  imageFile,
  userId,
}) => {
  try {
    if (!userId) {
      return { data: null, error: new Error('You must be logged in to create a listing.') };
    }

    if (!title || !title.trim()) {
      return { data: null, error: new Error('Please enter a product title.') };
    }

    const numericPrice = Number(price);
    if (isNaN(numericPrice) || numericPrice <= 0) {
      return { data: null, error: new Error('Please enter a valid price in INR.') };
    }

    let imagePath = null;

    // 1. Upload image to product-images bucket if file provided
    if (imageFile) {
      const { path, error: uploadError } = await uploadProductImage(imageFile, userId);
      if (uploadError) {
        return {
          data: null,
          error: new Error(`Failed to upload product image: ${uploadError.message}`),
        };
      }
      imagePath = path;
    }

    // 2. Insert record into listings table
    const newListingData = {
      title: title.trim(),
      description: description?.trim() || '',
      price: numericPrice,
      category: category || 'Others',
      condition: condition || 'Good',
      image_path: imagePath,
      status: 'available',
      seller_id: userId,
    };

    const { data, error: insertError } = await supabase
      .from('listings')
      .insert([newListingData])
      .select()
      .single();

    if (insertError) {
      return { data: null, error: insertError };
    }

    return { data: normalizeListing(data), error: null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err : new Error(String(err)) };
  }
};

/**
 * Update an existing listing in the `listings` table.
 * 
 * @param {string|number} id - Listing ID
 * @param {Object} updates - Fields to update (title, price, category, condition, description, status, imageFile)
 * @param {string} [userId] - User ID if a new image file needs to be uploaded
 * @returns {Promise<{ data: Object|null, error: Error|null }>}
 */
export const updateListing = async (id, updates, userId = null) => {
  try {
    if (!id) {
      return { data: null, error: new Error('Listing ID is required.') };
    }

    const payload = {};

    if (updates.title !== undefined) payload.title = updates.title.trim();
    if (updates.name !== undefined) payload.title = updates.name.trim();
    if (updates.description !== undefined) payload.description = updates.description.trim();
    if (updates.price !== undefined) payload.price = Number(updates.price);
    if (updates.category !== undefined) payload.category = updates.category;
    if (updates.condition !== undefined) payload.condition = updates.condition;
    if (updates.status !== undefined) payload.status = updates.status;
    if (updates.image_path !== undefined) payload.image_path = updates.image_path;

    // Handle new image upload if provided during update
    if (updates.imageFile && userId) {
      const { path, error: uploadError } = await uploadProductImage(updates.imageFile, userId);
      if (uploadError) {
        return { data: null, error: new Error(`Image upload failed: ${uploadError.message}`) };
      }
      payload.image_path = path;
    }

    const { data, error } = await supabase
      .from('listings')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return { data: null, error };
    }

    return { data: normalizeListing(data), error: null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err : new Error(String(err)) };
  }
};

/**
 * Mark a listing as sold or toggle its status.
 * 
 * @param {string|number} id
 * @param {string} [status='sold'] - 'sold' or 'available'
 * @returns {Promise<{ data: Object|null, error: Error|null }>}
 */
export const markListingAsSold = async (id, status = 'sold') => {
  return updateListing(id, { status });
};

/**
 * Delete a listing from the `listings` table and optionally remove its image.
 * 
 * @param {string|number} id
 * @param {string|null} [imagePath] - Image path to delete from storage
 * @returns {Promise<{ error: Error|null }>}
 */
export const deleteListing = async (id, imagePath = null) => {
  try {
    if (!id) {
      return { error: new Error('Listing ID is required for deletion.') };
    }

    // 1. Delete image from storage if present
    if (imagePath && !imagePath.startsWith('http')) {
      try {
        await supabase.storage.from('product-images').remove([imagePath]);
      } catch (storageErr) {
        console.warn('Storage image deletion warning:', storageErr);
      }
    }

    // 2. Delete database row
    const { error } = await supabase
      .from('listings')
      .delete()
      .eq('id', id);

    if (error) {
      return { error };
    }

    return { error: null };
  } catch (err) {
    return { error: err instanceof Error ? err : new Error(String(err)) };
  }
};
