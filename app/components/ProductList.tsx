'use client'
import Image from 'next/image'
import { PlusCircle } from 'lucide-react'
import { useState } from 'react'

interface Product {
    id: number;
    nombre_producto: string;
    descripcion: string;
    precio: number;
    stock: number;
    marca: string;
    modelo: string;
    procesador: string;
    ram: number;
    almacenamiento: number;
}

interface ProductListProps {
    products: Product[]
    onAddToCart: (product: Product) => void
}

export default function ProductList({ products, onAddToCart }: ProductListProps) {
    // Estado para el número de página actual y el número de productos por página
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 3;

    // Calcular los productos que se deben mostrar para la página actual
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

    // Calcular el número total de páginas
    const totalPages = Math.ceil(products.length / productsPerPage);

    // Función para manejar el cambio de página
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div>
            <h2 className="text-3xl font-semibold mb-6 text-center">Productos</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentProducts.map((product) => (
                    <div key={product.id} className="card w-full bg-base-100 shadow-xl rounded-lg overflow-hidden">
                        <figure className="relative h-56">
                            <Image
                                src={`/images/${product.id}.jpg`}
                                alt={product.nombre_producto}
                                width={300}
                                height={200}
                                className="w-full h-full object-cover"
                            />
                        </figure>
                        <div className="card-body p-4">
                            <h3 className="card-title text-xl font-semibold">{product.nombre_producto}</h3>
                            <p className="text-sm text-gray-500 mb-4">{product.descripcion}</p>
                            <div className="text-sm text-gray-500 mb-4">
                                <p>Marca: {product.marca}</p>
                                <p>Modelo: {product.modelo}</p>
                                <p>Procesador: {product.procesador}</p>
                                <p>RAM: {product.ram} GB</p>
                                <p>Almacenamiento: {product.almacenamiento} GB</p>
                            </div>
                            <div className="card-actions justify-between items-center">
                                <span className="text-xl font-bold text-blue-600">
                                    S/. {product.precio.toFixed(2)}
                                </span>
                                <button
                                    onClick={() => onAddToCart(product)}
                                    className="btn btn-primary btn-sm flex items-center"
                                >
                                    <PlusCircle className="mr-2" size={20} />
                                    Añadir al carrito
                                </button>
                            </div>
                            <p className="text-sm text-gray-500 mt-2">Stock disponible: {product.stock}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Paginador */}
            <div className="flex justify-center mt-6">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="btn btn-outline btn-sm mx-2"
                >
                    Anterior
                </button>
                <span className="px-4 py-2 mx-2">{currentPage}</span>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="btn btn-outline btn-sm mx-2"
                >
                    Siguiente
                </button>
            </div>
        </div>
    );
}
