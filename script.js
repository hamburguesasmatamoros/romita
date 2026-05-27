/**
 * Control del flujo de pantallas (SPA Navigation)
 */
function showScreen(id) {
    // Buscamos todas las pantallas disponibles
    const screens = document.querySelectorAll('.screen');
    
    screens.forEach(s => {
        // Añadimos la clase para ocultar y removemos la de activación
        s.classList.add('hidden');
    });

    // Mostramos únicamente la pantalla seleccionada
    const target = document.getElementById(id);
    if (target) {
        target.classList.remove('hidden');
        // Pequeño timeout opcional por si deseas disparar animaciones internas
        target.scrollIntoView({ behavior: 'smooth' });
    }
}

/**
 * Inicialización y control del Carrusel de Imágenes (Álbumes)
 */
function iniciarCarrusel(id) {
    const album = document.getElementById(id);
    if (!album) return; // Salvaguarda por si el ID no existe

    const container = album.parentElement;
    const fotos = album.querySelectorAll("img");
    let index = 0;

    // Si ya existen botones de navegación previos, los eliminamos para evitar duplicados
    container.querySelectorAll('.nav-btn').forEach(btn => btn.remove());

    // Configuración inicial de las imágenes
    fotos.forEach((foto, i) => {
        if (i === 0) {
            foto.style.display = "block";
            foto.style.opacity = "1";
        } else {
            foto.style.display = "none";
            foto.style.opacity = "0";
        }
        // Añadimos transición para el efecto fade interno
        foto.style.transition = "opacity 0.4s ease-in-out";
    });

    // Crear botones con iconos limpios
    const btnPrev = document.createElement("button");
    btnPrev.innerHTML = '<i class="fa-solid fa-chevron-left"></i>';
    btnPrev.classList.add("nav-btn", "prev-btn");
    btnPrev.setAttribute("aria-label", "Imagen anterior");

    const btnNext = document.createElement("button");
    btnNext.innerHTML = '<i class="fa-solid fa-chevron-right"></i>';
    btnNext.classList.add("nav-btn", "next-btn");
    btnNext.setAttribute("aria-label", "Siguiente imagen");

    container.appendChild(btnPrev);
    container.appendChild(btnNext);

    // Función optimizada para mostrar la imagen con efecto Fade
    function mostrarImagen(targetIdx) {
        fotos.forEach((foto, idx) => {
            if (idx === targetIdx) {
                foto.style.display = "block";
                // Esperamos un milisegundo para que el navegador registre el display antes del opacity
                setTimeout(() => { foto.style.opacity = "1"; }, 10);
            } else {
                foto.style.opacity = "0";
                foto.style.display = "none";
            }
        });
    }

    // Eventos de navegación
    btnPrev.addEventListener("click", (e) => {
        e.stopPropagation(); // Evita disparar clics accidentales
        index = (index - 1 + fotos.length) % fotos.length;
        mostrarImagen(index);
    });

    btnNext.addEventListener("click", (e) => {
        e.stopPropagation();
        index = (index + 1) % fotos.length;
        mostrarImagen(index);
    });

    // 📸 Sistema de Visualización Lightbox (Ampliación)
    fotos.forEach(foto => {
        foto.addEventListener("click", () => {
            // Creamos el fondo oscuro
            const overlay = document.createElement("div");
            overlay.classList.add("overlay");
            document.body.appendChild(overlay);

            // Clonamos la foto original
            const ampliada = foto.cloneNode(true);
            ampliada.classList.add("foto-ampliada");
            // Limpiamos estilos heredados del carrusel en el clon
            ampliada.style.display = "block";
            ampliada.style.opacity = "1";
            document.body.appendChild(ampliada);

            // Creamos botón de cerrar
            const botonCerrar = document.createElement("button");
            botonCerrar.innerHTML = '<i class="fa-solid fa-xmark"></i>';
            botonCerrar.classList.add("cerrar-foto");
            botonCerrar.setAttribute("aria-label", "Cerrar imagen");
            document.body.appendChild(botonCerrar);

            // Función centralizada para destruir el Lightbox
            function cerrarLightbox() {
                ampliada.remove();
                overlay.remove();
                botonCerrar.remove();
            }

            // Cerrar por medio del botón, del fondo gris, o presionando la tecla Escape
            botonCerrar.addEventListener("click", cerrarLightbox);
            overlay.addEventListener("click", cerrarLightbox);
            
            const handleEsc = (e) => {
                if (e.key === "Escape") {
                    cerrarLightbox();
                    document.removeEventListener("keydown", handleEsc);
                }
            };
            document.addEventListener("keydown", handleEsc);
        });
    });
}

/**
 * Inicialización global cuando el DOM esté listo
 */
document.addEventListener("DOMContentLoaded", () => {
    iniciarCarrusel("album1");
    iniciarCarrusel("album2");
    iniciarCarrusel("album3");
});


