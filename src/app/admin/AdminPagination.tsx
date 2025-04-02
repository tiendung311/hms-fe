"use client";

import styles from "./AdminPagination.module.css";

interface AdminPaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export default function AdminPagination({
  totalPages,
  currentPage,
  onPageChange,
}: AdminPaginationProps) {
  return (
    <div className={styles.pagination}>
      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i}
          className={`${styles.pageButton} ${
            currentPage === i + 1 ? styles.activePage : ""
          }`}
          onClick={() => onPageChange(i + 1)}
        >
          {i + 1}
        </button>
      ))}
    </div>
  );
}
