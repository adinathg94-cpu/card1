import Link from "next/link";

interface PaginationProps {
  section?: string;
  currentPage?: number;
  totalPages?: number;
}

const Pagination: React.FC<PaginationProps> = ({
  section,
  currentPage = 1,
  totalPages = 1,
}) => {
  const indexPageLink = currentPage === 2;
  const hasPrevPage = currentPage > 1;
  const hasNextPage = totalPages > currentPage;

  const pageList: number[] = [];
  for (let i = 1; i <= totalPages; i++) {
    pageList.push(i);
  }

  return (
    totalPages > 1 && (
      <nav
        className="flex items-center justify-center space-x-3 py-8"
        aria-label="Pagination"
      >
        {hasPrevPage ? (
          <Link
            href={
              indexPageLink
                ? `${section ? "/" + section : "/"}`
                : `${section ? "/" + section : ""}/page/${currentPage - 1}`
            }
            className="rounded px-2 py-1.5 text-text-dark hover:bg-white  "
          >
            <span className="sr-only">Previous</span>
            <svg
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
              height={30}
              width={30}
            >
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        ) : (
          <span className="rounded px-2 py-1.5 text-white">
            <span className="sr-only">Previous</span>
            <svg
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
              height={30}
              width={30}
            >
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        )}

        {pageList.map((pagination, i) =>
          pagination === currentPage ? (
            <span
              key={i}
              aria-current="page"
              className="rounded bg-primary px-4 py-2 text-white  "
            >
              {pagination}
            </span>
          ) : (
            <Link
              key={i}
              href={
                i === 0
                  ? `${section ? "/" + section : "/"}`
                  : `${section ? "/" + section : ""}/page/${pagination}`
              }
              aria-current="page"
              className="rounded px-4 py-2 text-text-dark hover:bg-white  "
            >
              {pagination}
            </Link>
          )
        )}

        {hasNextPage ? (
          <Link
            href={`${section ? "/" + section : ""}/page/${currentPage + 1}`}
            className="rounded px-2 py-1.5 text-text-dark hover:bg-white  "
          >
            <span className="sr-only">Next</span>
            <svg
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
              height={30}
              width={30}
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        ) : (
          <span className="rounded px-2 py-1.5 text-white">
            <span className="sr-only">Next</span>
            <svg
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
              height={30}
              width={30}
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        )}
      </nav>
    )
  );
};

export default Pagination;