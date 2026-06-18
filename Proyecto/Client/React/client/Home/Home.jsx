import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CategoryCard from "../CategoryCard/CategoryCard";
import CategoryCardSkeleton from "../CategoryCard/CategoryCardSkeleton";
import "../Skeleton/SkeletonBlock.css";
import "./Home.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

function Home() {
  const [categories, setCategories] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [categoriesError, setCategoriesError] = useState("");
  const [heroImageLoaded, setHeroImageLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadCategories = async () => {
      setIsLoadingCategories(true);
      setCategoriesError("");

      try {
        const response = await fetch(`${API_BASE_URL}/categories`);
        const payload = await response.json().catch(() => []);

        if (!response.ok) {
          throw new Error(payload?.error || "No se pudieron cargar las categorías.");
        }

        if (isMounted) {
          setCategories(Array.isArray(payload) ? payload : []);
        }
      } catch (error) {
        console.error("Error cargando categorías:", error);
        if (isMounted) {
          setCategories([]);
          setCategoriesError(error.message || "No se pudieron cargar las categorías.");
        }
      } finally {
        if (isMounted) {
          setIsLoadingCategories(false);
        }
      }
    };

    loadCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="container">
      <section className="hero">
        <div className="hero__content">
          <p className="hero__kicker">#HARTA - CERAMICA DE DISEÑO</p>
          <h2>PIEZAS DE CERAMICA PARA SOBREVIVIR A LA RUTINA</h2>
          <p className="hero__subtitle">
            Frases reales para dias reales
          </p>
          <div className="hero__actions">
            <Link className="hero__cta hero__cta-primary" to="/products">
              Comprar ahora
            </Link>
            <a className="hero__cta hero__cta-secondary" href="#categorias">
              Ver colección
            </a>
          </div>

          <div className="hero__trust">
            <span>Piezas unicas</span>
            <span>Stock real</span>
          </div>
        </div>

        <div className="hero__visual">
          <div className="hero__visual-glow" />
          {!heroImageLoaded && <span className="hero__image-placeholder skeleton-block" aria-hidden="true" />}
          <img
            className={heroImageLoaded ? "hero__image hero__image--loaded" : "hero__image"}
            src="/src/assets/Imagen-harta.jpeg"
            alt="#Harta Imagen"
            onLoad={() => setHeroImageLoaded(true)}
          />
          {/* <span className="hero__floating-badge hero__floating-badge-top">+500 clientes</span>
          <span className="hero__floating-badge hero__floating-badge-bottom">Envíos 24hs</span> */}
        </div>
      </section>

      <header className="products-header" id="categorias">
        <div className="products-header__content">
          <h2>Chusmea nuestras categorias</h2>
          <p>
            Elegí tu estilo y encontrá productos listos para sumar al carrito.
          </p>
        </div>
      </header>

      {isLoadingCategories ? (
        <div className="grid" aria-label="Cargando categorías">
          {Array.from({ length: 6 }, (_, index) => (
            <CategoryCardSkeleton key={index} />
          ))}
        </div>
      ) : categoriesError ? (
        <p className="categories-state categories-state--error">{categoriesError}</p>
      ) : categories.length === 0 ? (
        <p className="categories-state">No hay categorías activas por ahora.</p>
      ) : (
        <div className="grid">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              title={category.name}
              category={category.id}
              image={category.image_url}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
