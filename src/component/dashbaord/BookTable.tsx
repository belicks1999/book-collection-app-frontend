import { useState } from "react";
import { Edit, Trash, Plus, Search } from "lucide-react";
import axios from "axios";
import {
  useQuery,
  useMutation,
  QueryClient,
  useQueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import DeleteModal from "../common/DeleteModal";
import { Button, Input } from "@heroui/react";
import { toast } from "react-toastify";

// API endpoints - you can change these later
const API_URL = "http://localhost:5000/api/books";

// API functions
const fetchBooks = async () => {
  const token = localStorage.getItem("token");

  const response = await axios.get(`${API_URL}/my-books`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

const addBook = async (bookData) => {
  const token = localStorage.getItem("token");
  const response = await axios.post(`${API_URL}/add-book`, bookData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const updateBook = async (bookData) => {
  const token = localStorage.getItem("token");
  const response = await axios.put(`${API_URL}/${bookData._id}`, bookData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const deleteBook = async (id) => {
  const token = localStorage.getItem("token");
  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentBook, setCurrentBook] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState(null);

  const queryClient = useQueryClient();

  // React Query hooks
  const {
    data: books = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["books"],
    queryFn: fetchBooks,
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to fetch books.");
    },
  });

  // React Hook Form for Add Book
  const addForm = useForm({
    defaultValues: {
      title: "",
      author: "",
      genre: "",
      description: "",
      publicationDate: "",
    },
  });

  // React Hook Form for Edit Book
  const editForm = useForm({
    defaultValues: {
      title: "",
      author: "",
      genre: "",
      description: "",
      publicationDate: "",
    },
  });

  // Add Book Mutation
  const addMutation = useMutation({
    mutationFn: addBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      setShowAddModal(false);
      addForm.reset();
      toast.success("Book added successfully!");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to add book.");
    },
  });

  // Update Book Mutation
  const updateMutation = useMutation({
    mutationFn: updateBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      setShowEditModal(false);
      setCurrentBook(null);
      toast.success("Book updated successfully!");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update book.");
    },
  });

  // Delete Book Mutation
  const deleteMutation = useMutation({
    mutationFn: deleteBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      setShowDeleteModal(false);
      setSelectedBookId(null);
      toast.success("Book deleted successfully!");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete book.");
    },
  });

  // Filter books based on search term
  const filteredBooks = books?.data?.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.genre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditClick = (book) => {
    setCurrentBook(book);
    editForm.reset({
      title: book.title,
      author: book.author,
      genre: book.genre,
      description: book.description,
      publicationDate: book.publicationDate
        ? book.publicationDate.split("T")[0]
        : "",
    });
    setShowEditModal(true);
  };

  const handleDeleteClick = (id) => {
    setSelectedBookId(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    deleteMutation.mutate(selectedBookId);
  };

  const onAddSubmit = (data) => {
    addMutation.mutate(data);
  };

  const onEditSubmit = (data) => {
    updateMutation.mutate({ _id: currentBook._id, ...data });
  };

  // Modal component
  const Modal = ({ show, title, onClose, children }) => {
    if (!show) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center min-h-screen justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              &times;
            </button>
          </div>
          {children}
        </div>
      </div>
    );
  };

  // Book form component using React Hook Form
  const BookForm = ({ form, onSubmit, submitText, isSubmitting }) => {
    const { handleSubmit, control, formState } = form;

    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="title"
          >
            Title
          </label>
          <Controller
            name="title"
            control={control}
            rules={{ required: "Title is required" }}
            render={({ field, fieldState }) => (
              <>
                <Input
                  {...field}
                  variant="bordered"
                  id="title"
                  type="text"
                  isInvalid={!!fieldState.error}
                />
                {fieldState.error && (
                  <p className="text-red-500 text-xs italic">
                    {fieldState.error.message}
                  </p>
                )}
              </>
            )}
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="author"
          >
            Author
          </label>
          <Controller
            name="author"
            control={control}
            rules={{ required: "Author is required" }}
            render={({ field, fieldState }) => (
              <>
                <Input
                  {...field}
                  variant="bordered"
                  id="author"
                  type="text"
                  isInvalid={!!fieldState.error}
                />
                {fieldState.error && (
                  <p className="text-red-500 text-xs italic">
                    {fieldState.error.message}
                  </p>
                )}
              </>
            )}
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="genre"
          >
            Genre
          </label>
          <Controller
            name="genre"
            control={control}
            rules={{ required: "Genre is required" }}
            render={({ field, fieldState }) => (
              <>
                <Input
                  {...field}
                  variant="bordered"
                  id="genre"
                  type="text"
                  isInvalid={!!fieldState.error}
                />
                {fieldState.error && (
                  <p className="text-red-500 text-xs italic">
                    {fieldState.error.message}
                  </p>
                )}
              </>
            )}
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="Description"
          >
            Description
          </label>
          <Controller
            name="description"
            control={control}
            rules={{ required: "description is required" }}
            render={({ field, fieldState }) => (
              <>
                <Input
                  {...field}
                  variant="bordered"
                  id="description"
                  type="text"
                  isInvalid={!!fieldState.error}
                />
                {fieldState.error && (
                  <p className="text-red-500 text-xs italic">
                    {fieldState.error.message}
                  </p>
                )}
              </>
            )}
          />
        </div>
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="publicationDate"
          >
            Publication Date
          </label>
          <Controller
            name="publicationDate"
            control={control}
            rules={{ required: "Publication date is required" }}
            render={({ field, fieldState }) => (
              <>
                <Input
                  {...field}
                  id="publicationDate"
                  type="date"
                  variant="bordered"
                  isInvalid={!!fieldState.error}
                />
                {fieldState.error && (
                  <p className="text-red-500 text-xs italic">
                    {fieldState.error.message}
                  </p>
                )}
              </>
            )}
          />
        </div>
        <div className="flex items-center justify-end">
          <Button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-blue-300"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Processing..." : submitText}
          </Button>
        </div>
      </form>
    );
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl min-h-screen mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Books Dashboard
        </h1>

        <div className="mt-6 flex flex-col">
          <div className="mb-4 sm:flex justify-between items-center">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Search books..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              className="flex items-center px-4 py-2 mt-3 sm:mt-0 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => {
                addForm.reset();
                setShowAddModal(true);
              }}
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Book
            </button>
          </div>

          {isError && (
            <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
              Error loading books: {error.message}
            </div>
          )}

          <div className="overflow-x-auto">
            <div className="align-middle inline-block min-w-full">
              <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Title
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Author
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Genre
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Description
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Publication Date
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {isLoading ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-6 py-4 whitespace-nowrap text-center"
                        >
                          Loading...
                        </td>
                      </tr>
                    ) : filteredBooks.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-6 py-4 whitespace-nowrap text-center"
                        >
                          No books found.
                        </td>
                      </tr>
                    ) : (
                      filteredBooks.map((book) => (
                        <tr key={book._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {book.title}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {book.author}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {book.genre}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-normal break-words max-w-xs">
                            <div className="text-sm text-gray-900">
                              {book.description}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {new Date(
                                book.publicationDate
                              ).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap  mx-auto text-sm font-medium">
                            <button
                              className="text-blue-600 hover:text-blue-900 mr-4"
                              onClick={() => handleEditClick(book)}
                            >
                              <Edit className="h-5 w-5" />
                            </button>
                            <button
                              className="text-red-600 hover:text-red-900"
                              onClick={() => handleDeleteClick(book._id)}
                            >
                              <Trash className="h-5 w-5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <DeleteModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleConfirmDelete}
          isDeleting={deleteMutation.isPending}
        />
      </div>

      {/* Add Book Modal */}
      <Modal
        show={showAddModal}
        title="Add New Book"
        onClose={() => setShowAddModal(false)}
      >
        <BookForm
          form={addForm}
          onSubmit={onAddSubmit}
          submitText="Add Book"
          isSubmitting={addMutation.isPending}
        />
      </Modal>

      {/* Edit Book Modal */}
      <Modal
        show={showEditModal}
        title="Edit Book"
        onClose={() => setShowEditModal(false)}
      >
        <BookForm
          form={editForm}
          onSubmit={onEditSubmit}
          submitText="Save Changes"
          isSubmitting={updateMutation.isPending}
        />
      </Modal>
    </div>
  );
};
export default Dashboard;
