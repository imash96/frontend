// TODO: recheck logic on pagination
export default function usePagination(
  currentPage: number,
  count: number,
  limit: number,
) {
  const totalPages = Math.ceil(count / limit);
  const start = (currentPage - 1) * limit;
  const end = start + limit;

  const getPageNumbers = () => {
    const delta = 2;
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== "...") {
        pages.push("...");
      }
    }
    return pages;
  };

  return { start, end, totalPages, getPageNumbers };
}
