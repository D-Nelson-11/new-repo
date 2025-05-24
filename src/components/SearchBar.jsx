import React, { useState, useEffect, useRef } from "react";
import styles from "../public/SearchBar.module.css"; // Suponiendo que usas CSS Modules

const SearchBar = ({ items, register, setValue, i, hija, getValues }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const searchBarRef = useRef(null); // Referencia al contenedor de la barra de búsqueda

  useEffect(() => {
    console.log("items", items);
    const handleClickOutside = (event) => {
      // Si se hace clic fuera del componente, cierra los resultados
      if (
        searchBarRef.current &&
        !searchBarRef.current.contains(event.target)
      ) {
        setSearchTerm(""); // Cierra la lista de resultados
      }
    };

    // Añadir el evento cuando el componente está montado
    document.addEventListener("mousedown", handleClickOutside);

    // Limpiar el evento cuando el componente se desmonte
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = items.filter(
      (item) =>
        item.Sitio1Nombre?.toLowerCase().includes(value) ||
        item.Sitio2Nombre?.toLowerCase().includes(value)
    );
    setFilteredItems(filtered);
  };

  return (
    <div className={styles.search_bar} ref={searchBarRef}>
      <label
        htmlFor=""
        style={{
          fontSize: "14px",
          backgroundColor: "#f7faf8 ",
          borderRadius: "3px",
          borderRight: "1px solid #ccc",
          padding: "5px",
        }}
        onClick={() => {
          const idBuscado = hija ? getValues(`segmentoH${i}`) : getValues(`segmento${i}`);
          const itemSeleccionado = items.find((item) => item.Id === idBuscado);

          if (itemSeleccionado) {
            alert(
              `sitio1Id: ${itemSeleccionado.Sitio1Id}\nsitio2Id: ${itemSeleccionado.Sitio2Id}`
            );
          } else {
            alert("No se encontró el segmento");
          }
        }}>
        Segm
      </label>
      <input
        type="hidden"
        {...register(hija ? `segmentoH${i}` : `segmento${i}`)}
      />
      {!hija ? (
        <input
          type="text"
          autoComplete="off"
          placeholder="Buscar..."
          {...register(`Nsegmento${i}`)}
          onChange={handleSearch}
          className={styles.search_input}
        />
      ) : (
        <input
          type="text"
          placeholder="Buscar..."
          {...register(`NsegmentoH${i}`)}
          onChange={handleSearch}
          className={styles.search_input}
        />
      )}
      {searchTerm && (
        <ul className={styles.search_results}>
          {filteredItems
            .sort((a, b) => {
              const nameA =
                `${a.Sitio1Nombre} - ${a.Sitio2Nombre}`.toLowerCase();
              const nameB =
                `${b.Sitio1Nombre} - ${b.Sitio2Nombre}`.toLowerCase();
              return nameA.localeCompare(nameB);
            })
            .map((item, index) => (
              <li
                style={{ fontSize: "10px" }}
                key={index}
                className={styles.search_item}
                onClick={() => {
                  if (hija) {
                    setValue(
                      `NsegmentoH${i}`,
                      `${item.Sitio1Nombre} - ${item.Sitio2Nombre}`
                    );
                    setValue(`segmentoH${i}`, item.Id);
                  } else {
                    setValue(
                      `Nsegmento${i}`,
                      `${item.Sitio1Nombre} - ${item.Sitio2Nombre}`
                    );
                    setValue(`segmento${i}`, item.Id);
                  }
                  setSearchTerm("");
                }}>
                {item.Sitio1Nombre} - {item.Sitio2Nombre}
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
