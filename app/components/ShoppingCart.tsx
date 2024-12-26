'use client'
import { FileText, MinusCircle, PlusCircle, Trash2 } from 'lucide-react'

interface CartItem {
    id: number
    nombre_producto: string
    precio: number
    quantity: number
}

interface ShoppingCartProps {
    cart: CartItem[]
    onGenerateInvoice: () => void
    onUpdateQuantity: (productId: number, quantity: number) => void
    onRemoveFromCart: (productId: number) => void
    isGenerating?: boolean
    error?: string | null
}

export default function ShoppingCart({
    cart,
    onGenerateInvoice,
    onUpdateQuantity,
    onRemoveFromCart,
    isGenerating = false,
    error = null
}: ShoppingCartProps) {
    return (
        <div className="bg-base-200 p-4 rounded-lg shadow-xl max-w-3xl mx-auto">
            <h2 className="text-xl font-semibold text-primary mb-4">Carrito de Compras</h2>
            {cart.length === 0 ? (
                <p className="text-secondary text-sm">El carrito está vacío</p>
            ) : (
                <div className="space-y-4">
                    {cart.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                            <div className="flex items-center">
                                <span className="font-semibold text-base text-gray-800">{item.nombre_producto}</span>
                                <div className="flex items-center ml-4">
                                    <button
                                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                                        className="btn btn-ghost btn-xs text-gray-500 hover:text-gray-700"
                                        disabled={isGenerating}
                                    >
                                        <MinusCircle size={20} />
                                    </button>
                                    <span className="mx-2 text-base font-semibold">{item.quantity}</span>
                                    <button
                                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                        className="btn btn-ghost btn-xs text-gray-500 hover:text-gray-700"
                                        disabled={isGenerating}
                                    >
                                        <PlusCircle size={20} />
                                    </button>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <span className="font-semibold text-lg text-blue-600 mr-2">S/. {(item.precio * item.quantity).toFixed(2)}</span>
                                <button
                                    onClick={() => onRemoveFromCart(item.id)}
                                    className="btn btn-ghost btn-xs text-red-500 hover:text-red-700"
                                    disabled={isGenerating}
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>
                    ))}
                    <div className="flex items-center justify-between font-semibold text-base text-gray-800">
                        <span>Total:</span>
                        <span className="text-primary">S/. {cart.reduce((total, item) => total + item.precio * item.quantity, 0).toFixed(2)}</span>
                    </div>

                    {error && (
                        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
                            {error}
                        </div>
                    )}

                    <button
                        onClick={onGenerateInvoice}
                        disabled={isGenerating || cart.length === 0}
                        className={`mt-4 w-full ${isGenerating || cart.length === 0
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'btn btn-success btn-sm'
                            } text-white px-4 py-2 rounded-lg transition duration-300 flex items-center justify-center`}
                    >
                        <FileText className="mr-2" size={18} />
                        {isGenerating ? 'Generando...' : 'Generar Factura'}
                    </button>
                </div>
            )}
        </div>
    )
}
