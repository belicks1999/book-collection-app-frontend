"use client";
import { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import Header from "../src/component/common/Header";
import Footer from "../src/component/common/Footer";

type Book = {
  _id: string;
  title: string;
  author: string;
  genre: string;
  publicationDate: string;
  description: string;
  user: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

type BooksResponse = {
  success: boolean;
  count: number;
  data: Book[];
};

const fetchBooks = async (): Promise<BooksResponse> => {
  const token = localStorage.getItem("token");
  const res = await axios.get("http://localhost:5000/api/books/my-books", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export default function BooksPage() {
  const [search, setSearch] = useState("");
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const {
    data: booksResponse,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["books"],
    queryFn: fetchBooks,
  });

  // Safely access the books array
  const books = booksResponse?.data || [];

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleCardClick = (book: Book) => {
    setSelectedBook(book);
    onOpen();
  };

  return (
    <>
      <Header />
      <div className="bg-blue-100">
        <div className="p-6 max-w-7xl min-h-screen mx-auto">
          <div className="mb-6 w-fit">
            <Input
              isClearable
              placeholder="Search books..."
              value={search}
              onValueChange={setSearch}
              className="w-56"
            />
          </div>

          {isLoading && <p>Loading books...</p>}
          {isError && <p className="text-red-500">Failed to fetch books.</p>}

          {/* Cards */}
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {filteredBooks.map((book) => (
              <Card
                key={book._id}
                isPressable
                onPress={() => handleCardClick(book)}
                className="hover:shadow-md transition-shadow"
              >
                <CardBody className="p-0">
                  <img
                    src="https://img.freepik.com/free-photo/book-composition-with-open-book_23-2147690555.jpg?semt=ais_hybrid&w=740"
                    alt={book.title}
                    className="w-full h-40 object-cover rounded-t-lg"
                  />
                </CardBody>
                <CardHeader className="font-semibold text-lg px-4 pt-2">
                  {book.title}
                </CardHeader>
                <CardBody className="text-sm text-default-500 px-4 pb-4">
                  {book.author}
                </CardBody>
              </Card>
            ))}
          </div>

          {/* Modal */}
          <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader>{selectedBook?.title}</ModalHeader>
                  <ModalBody>
                    <p>
                      <strong>Author:</strong> {selectedBook?.author}
                    </p>
                    <p>
                      <strong>Genre:</strong> {selectedBook?.genre}
                    </p>
                    <p>
                      <strong>Publication Date:</strong>{" "}
                      {selectedBook?.publicationDate
                        ? new Date(
                            selectedBook.publicationDate
                          ).toLocaleDateString()
                        : ""}
                    </p>
                    <p>
                      <strong>Description:</strong>
                    </p>
                    <p>{selectedBook?.description}</p>
                  </ModalBody>
                  <ModalFooter>
                    <Button color="primary" onPress={onClose}>
                      Close
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
        </div>
      </div>

      <Footer />
    </>
  );
}
