import { json, redirect } from "@remix-run/node";
import { useLoaderData, useActionData, Form } from "@remix-run/react";
import type { LoaderFunction, ActionFunction } from "@remix-run/node";
import { getCategories, createCategory, updateCategory, deleteCategory, updateCategoryOrder } from "~/models/category.server";
import type { Category } from "~/types/category";

export const loader: LoaderFunction = async ({ request }) => {
  const categories = await getCategories();
  return json({ categories });
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const intent = formData.get("intent");

  switch (intent) {
    case "create": {
      const name = formData.get("name") as string;
      const description = formData.get("description") as string;
      const isVisible = formData.get("isVisible") === "true";

      await createCategory({ name, description, isVisible });
      return redirect("/admin/categories");
    }

    case "update": {
      const id = formData.get("id") as string;
      const name = formData.get("name") as string;
      const description = formData.get("description") as string;
      const isVisible = formData.get("isVisible") === "true";

      await updateCategory(id, { name, description, isVisible });
      return redirect("/admin/categories");
    }

    case "delete": {
      const id = formData.get("id") as string;
      await deleteCategory(id);
      return redirect("/admin/categories");
    }

    case "reorder": {
      const order = JSON.parse(formData.get("order") as string);
      await updateCategoryOrder(order);
      return json({ success: true });
    }

    default:
      return json({ error: "Invalid action" }, { status: 400 });
  }
};

export default function CategoriesAdmin() {
  const { categories } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-2xl font-semibold text-gray-900">Kategorioiden hallinta</h1>
        
        {/* Category List */}
        <div className="mt-8">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">Kategoriat</h2>
            <button
              type="button"
              onClick={() => {
                // Open create category modal
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Lisää kategoria
            </button>
          </div>

          <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-md">
            <ul role="list" className="divide-y divide-gray-200">
              {categories.map((category) => (
                <li key={category.id}>
                  <div className="px-4 py-4 flex items-center justify-between sm:px-6">
                    <div className="flex items-center">
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{category.name}</p>
                        {category.description && (
                          <p className="text-sm text-gray-500">{category.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Form method="post" className="flex items-center">
                        <input type="hidden" name="id" value={category.id} />
                        <input
                          type="hidden"
                          name="isVisible"
                          value={(!category.isVisible).toString()}
                        />
                        <button
                          type="submit"
                          name="intent"
                          value="update"
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            category.isVisible
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {category.isVisible ? "Näkyvissä" : "Piilotettu"}
                        </button>
                      </Form>
                      
                      <button
                        type="button"
                        onClick={() => {
                          // Open edit category modal
                        }}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <span className="sr-only">Muokkaa</span>
                        {/* Edit icon */}
                      </button>
                      
                      <Form method="post" className="flex items-center">
                        <input type="hidden" name="id" value={category.id} />
                        <button
                          type="submit"
                          name="intent"
                          value="delete"
                          className="text-red-400 hover:text-red-500"
                          onClick={(e) => {
                            if (!confirm("Haluatko varmasti poistaa tämän kategorian?")) {
                              e.preventDefault();
                            }
                          }}
                        >
                          <span className="sr-only">Poista</span>
                          {/* Delete icon */}
                        </button>
                      </Form>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
