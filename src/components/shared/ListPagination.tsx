import {
  Pagination,
  PaginationLink,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
} from "../ui/pagination";

const ListPagination = ({
  currentPage,
  totalPages,
  handlePageChange,
  itemsLength,
}: {
  currentPage: number;
  totalPages: number;
  handlePageChange: (page: number) => void;
  itemsLength: number;
}) => {
  return (
    itemsLength > 0 && (
      <div className="flex justify-center mt-8">
        <Pagination>
          <PaginationContent>
            {currentPage > 1 && (
              <PaginationItem>
                <PaginationLink
                  onClick={() => handlePageChange(1)}
                  isActive={currentPage === 1}
                >
                  First
                </PaginationLink>
              </PaginationItem>
            )}
            {currentPage > 1 && (
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(currentPage - 1)}
                />
              </PaginationItem>
            )}
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) =>
              currentPage + i - 2 > 0 && currentPage + i - 2 <= totalPages
                ? Math.max(1, Math.min(totalPages, currentPage + i - 2))
                : null
            )
              .filter(Boolean)
              .map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => handlePageChange(page ?? 0)}
                    isActive={page === currentPage}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
            {currentPage < totalPages && (
              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(currentPage + 1)}
                />
              </PaginationItem>
            )}
            {currentPage < totalPages && (
              <PaginationItem>
                <PaginationLink onClick={() => handlePageChange(totalPages)}>
                  Last
                </PaginationLink>
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      </div>
    )
  );
};

export default ListPagination;
