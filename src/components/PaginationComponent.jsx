import React from "react";
import Pagination from "react-bootstrap/Pagination";
import '../css/PaginationComponent.css'; // Importa el archivo de estilos

const PaginationComponent = ({ totalPages, currentPage, setPage }) => {

  const handlePageClick = (page) => {
    if (page > 0 && page <= totalPages) {
      setPage(page);
    }
  };

  // Función para generar los 9 espacios de paginación
  const getPageItems = () => {
    const pages = [];

    // Espacio 1: Botón "<"
    pages.push(
      <Pagination.Prev
        key="prev"
        onClick={() => handlePageClick(currentPage - 1)}
        disabled={currentPage === 1}
        className="pagination-prev"
      />
    );

    // Espacio 2: Botón "<<" o vacío
    pages.push(
      currentPage > 2 ? (
        <Pagination.First key="first" onClick={() => handlePageClick(1)} className="pagination-first" />
      ) : (
        <Pagination.Item key="empty-first" disabled className="pagination-item btn-void">{' '}</Pagination.Item>
      )
    );

    // Espacio 3: Botón "..." o vacío
    pages.push(
      currentPage > 2 ? (
        <Pagination.Ellipsis key="ellipsis1" className="pagination-item" />
      ) : (
        <Pagination.Item key="empty-ellipsis1" disabled className="pagination-item btn-void">{' '}</Pagination.Item>
      )
    );

    // Espacio 4: Primer número visible o vacío
    pages.push(
      currentPage > 2 ? (
        <Pagination.Item key={currentPage - 1} onClick={() => handlePageClick(currentPage - 1)} className="pagination-item">
          {currentPage - 1}
        </Pagination.Item>
      ) : (
        currentPage > 1 ? (
          <Pagination.Item key={1} onClick={() => handlePageClick(1)} className="pagination-item">
            {1}
          </Pagination.Item>
        ) : (
          <Pagination.Item key="empty-num1" disabled className="pagination-item btn-void">{' '}</Pagination.Item>
        )
      )
    );

    // Espacio 5: Página actual
    pages.push(
      <Pagination.Item key={currentPage} active className="pagination-item">
        {currentPage}
      </Pagination.Item>
    );

    // Espacio 6: Segundo número visible o vacío
    pages.push(
      currentPage < totalPages - 1 ? (
        <Pagination.Item key={currentPage + 1} onClick={() => handlePageClick(currentPage + 1)} className="pagination-item">
          {currentPage + 1}
        </Pagination.Item>
      ) : (
        currentPage < totalPages ? (
          <Pagination.Item key={totalPages} onClick={() => handlePageClick(totalPages)} className="pagination-item">
            {totalPages}
          </Pagination.Item>
        ) : (
          <Pagination.Item key="empty-num2" disabled className="pagination-item btn-void">{' '}</Pagination.Item>
        )
      )
    );

    // Espacio 7: "..." o vacío
    pages.push(
      currentPage < totalPages - 1 ? (
        <Pagination.Ellipsis key="ellipsis2" className="pagination-item" />
      ) : (
        <Pagination.Item key="empty-ellipsis2" disabled className="pagination-item btn-void">{' '}</Pagination.Item>
      )
    );

    // Espacio 8: ">>" o vacío
    pages.push(
      currentPage < totalPages - 1 ? (
        <Pagination.Last key="last" onClick={() => handlePageClick(totalPages)} className="pagination-last" />
      ) : (
        <Pagination.Item key="empty-last" disabled className="pagination-item btn-void">{' '}</Pagination.Item>
      )
    );

    // Espacio 9: Botón ">"
    pages.push(
      <Pagination.Next
        key="next"
        onClick={() => handlePageClick(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="pagination-next"
      />
    );

    return pages;
  };

  return (
    <Pagination className="justify-content-center mt-3">
      {getPageItems()}
    </Pagination>
  );
};

export default PaginationComponent;