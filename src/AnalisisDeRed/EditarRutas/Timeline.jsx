import { useState, useRef, useEffect } from "react";
import styles from "../../public/timeline.module.css";

export function TimeLine({ items, onEdit, onDelete }) {
  const [activeIndex, setActiveIndex] = useState(null);
  const containerRef = useRef(null);

  const handleToggle = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  // efecto para cerrar acciones al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setActiveIndex(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={containerRef} className={styles.timeline_container}>
      <div className={styles.timeline}>
        {items.sort((a, b) => a.Orden - b.Orden).map((item, index) => (
          <div key={item.id ?? index} className={styles.timeline_item}>
            <div className={styles.circle_container}>
              <button
                className={`${styles.circle} ${item.active ? styles.active : ""}`}
                onClick={() => handleToggle(index)}
              >
                {item.title?.charAt(0) ?? index + 1}
              </button>

              {activeIndex === index && (
                <div className={styles.actions}>
                  <button onClick={() => onEdit(item)}>Editar</button>
                  <button onClick={() => onDelete(item)}>Eliminar</button>
                </div>
              )}

              {item.Sitio?.Nombre && (
                <div className={styles.subtitle}>{item.Sitio.Nombre}</div>
              )}
            </div>

            {index < items.length - 1 && <div className={styles.line}></div>}
          </div>
        ))}
      </div>
    </div>
  );
}
