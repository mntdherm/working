import { supabase } from "~/lib/supabase.server";
import type { Category, CategoryFormData, Service, ServiceFormData } from "~/types/category";

export async function getCategories() {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("order_index");

  if (error) throw error;
  return data as Category[];
}

export async function getCategoryWithServices(categoryId: string) {
  const { data, error } = await supabase
    .from("categories")
    .select(`
      *,
      services (*)
    `)
    .eq("id", categoryId)
    .single();

  if (error) throw error;
  return data;
}

export async function createCategory(data: CategoryFormData) {
  // Get the highest order_index
  const { data: categories } = await supabase
    .from("categories")
    .select("order_index")
    .order("order_index", { ascending: false })
    .limit(1);

  const newOrderIndex = categories?.[0]?.order_index + 1 || 0;

  const { data: category, error } = await supabase
    .from("categories")
    .insert({
      name: data.name,
      description: data.description,
      slug: createSlug(data.name),
      is_visible: data.isVisible,
      order_index: newOrderIndex
    })
    .select()
    .single();

  if (error) throw error;
  return category;
}

export async function updateCategory(id: string, data: CategoryFormData) {
  const { data: category, error } = await supabase
    .from("categories")
    .update({
      name: data.name,
      description: data.description,
      slug: createSlug(data.name),
      is_visible: data.isVisible
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return category;
}

export async function updateCategoryOrder(categories: { id: string; orderIndex: number }[]) {
  const { error } = await supabase.rpc("update_category_order", {
    category_orders: categories
  });

  if (error) throw error;
}

export async function deleteCategory(id: string) {
  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

// Helper function to create URL-friendly slugs
function createSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}
