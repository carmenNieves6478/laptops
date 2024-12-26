'use client';

import { useEffect, useState } from 'react';
import { ShoppingCart, FileText } from 'lucide-react';
import ProductList from './components/ProductList';
import ShoppingCartComponent from './components/ShoppingCart';
import ClientForm from './components/ClientForm';

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

interface CartItem {
  id: number;
  nombre_producto: string;
  precio: number;
  quantity: number;
}

interface Client {
  id: number;
  nombre: string;
  ruc_dni: string;
  direccion: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [invoicePdf, setInvoicePdf] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(
        data.map((product: any) => ({
          ...product,
          precio: typeof product.precio === 'string' ? parseFloat(product.precio) : product.precio,
        }))
      );
    }
    fetchProducts();
  }, []);

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prevCart,
        { id: product.id, nombre_producto: product.nombre_producto, precio: product.precio, quantity: 1 },
      ];
    });
  };

  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
    } else {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.id === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const removeFromCart = (productId: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const generateInvoice = async () => {
    if (cart.length === 0) {
      setError('El carrito está vacío');
      return;
    }

    if (!selectedClient) {
      setError('Por favor seleccione un cliente');
      return;
    }

    setIsGenerating(true);
    setError(null);

    const invoiceData = {
      ublVersion: '2.1',
      tipoOperacion: '0101',
      tipoDoc: '03',
      serie: 'B001',
      correlativo: '1',
      fechaEmision: new Date().toISOString().split('.')[0] + '-05:00',
      formaPago: {
        moneda: 'PEN',
        tipo: 'Contado'
      },
      tipoMoneda: 'PEN',
      tienda: 'Principal',
      client: {
        tipoDoc: selectedClient.ruc_dni.length === 11 ? '6' : '1',
        numDoc: selectedClient.ruc_dni,
        rznSocial: selectedClient.nombre,
        address: {
          direccion: selectedClient.direccion,
          provincia: 'LIMA',
          departamento: 'LIMA',
          distrito: 'LIMA',
          ubigueo: '150101',
        },
      },
      company: {
        ruc: 27453345213,
        razonSocial: 'Empresa de Laptops',
        nombreComercial: 'Laptech',
        address: {
          direccion: 'JR Lima 234',
          provincia: 'LIMA',
          departamento: 'LIMA',
          distrito: 'LIMA',
          ubigueo: '150101',
        },
      },
      mtoOperGravadas: cart.reduce((total, item) => total + item.precio * item.quantity, 0),
      mtoIGV: cart.reduce((total, item) => total + item.precio * item.quantity * 0.18, 0),
      valorVenta: cart.reduce((total, item) => total + item.precio * item.quantity, 0),
      totalImpuestos: cart.reduce((total, item) => total + item.precio * item.quantity * 0.18, 0),
      subTotal: cart.reduce((total, item) => total + item.precio * item.quantity, 0) +
        cart.reduce((total, item) => total + item.precio * item.quantity * 0.18, 0),
      mtoImpVenta: cart.reduce((total, item) => total + item.precio * item.quantity, 0) +
        cart.reduce((total, item) => total + item.precio * item.quantity * 0.18, 0),
      details: cart.map(item => ({
        codProducto: item.id.toString(),
        unidad: 'NIU',
        descripcion: item.nombre_producto,
        cantidad: item.quantity,
        mtoValorUnitario: item.precio,
        mtoValorVenta: item.precio * item.quantity,
        mtoBaseIgv: item.precio * item.quantity,
        porcentajeIgv: 18,
        igv: item.precio * item.quantity * 0.18,
        tipAfeIgv: 10,
        totalImpuestos: item.precio * item.quantity * 0.18,
        mtoPrecioUnitario: item.precio * 1.18
      })),
      legends: [
        {
          code: '1000',
          value: `SON ${new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(
            cart.reduce((total, item) => total + item.precio * item.quantity, 0) +
            cart.reduce((total, item) => total + item.precio * item.quantity * 0.18, 0)
          )} SOLES`
        }
      ]
    };

    try {
      const response = await fetch('https://facturacion.apisperu.com/api/v1/invoice/pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJ1c2VybmFtZSI6ImNhcm1lbiIsImNvbXBhbnkiOiIyNzQ1MzM0NTIxMyIsImlhdCI6MTczNTIwNDMzNywiZXhwIjo4MDQyNDA0MzM3fQ.EXv6SYbCQU8HkbkEXnJUPWBEAZIELoS9PZ9z0i6V6SHM2aHZKlZteGp2G0SJEUXWMhzhXimAspC-eqMeveDWu85tLIoPwGvjGfaaspbDU2WA-4C2gp6tKkXfU5TgK3417KxsXfI72uFYMvHnfJiP5ixN_r289UE2fOz_hauEbNBbyjSUKhyNk4RGjhDv18jSRGDJMr5lexHpxgQgSIADE_maRe2nqUGKebEpHZMlTTr1ZBWOfxRAC5TUmWSo9AnBKQbPpKIDpvRA_8RqnlJ7cvA1g9FQpgZ_UJNdsBrVHtnZDjKlcUr39ISYXQITQwli9xGZ3XPdpFY5m5QRhEw7MsgML0f0Veq6LGx0tYbouaDc2WIXTNUeiJPbVPbW3UU-v8CQeDksjYrVOVcuFBTtVZaBD58QRexwtESlEe7jyzGQklJ4rBAZZs_ccn_HeXUoMLUL6sjYxx9sm1avdxix9XRIaV0lvP1bP5cvB6MvpxNf3Ojdm47ekh5XQykY1OXsN2VEnGZl1XAtUG4KfO52bGxCsK7mhEmBk8Efg0KyNDs0fb180SQQkzlMZyw9h9ojWnCl3WKbRxtXxstpjLPMzhdi4OWywkQPecIfewUiE3KrQTeJ43Xb6Sdq1CWdlaVq2H5WBCBLSU-kWcYUcLB9cCL3APOSMeGTp3pvb3cNL1k'
        },
        body: JSON.stringify(invoiceData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const blob = await response.blob();
      const pdfUrl = URL.createObjectURL(blob);

      setInvoicePdf(pdfUrl);
      setError(null);
      // Limpiar el carrito después de generar la factura exitosamente
      setCart([]);
    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : 'Error al generar la factura');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 flex items-center">
        <ShoppingCart className="mr-2" />
        Tienda de Laptops
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <ProductList products={products} onAddToCart={addToCart} />
        </div>
        <div>
          <ClientForm onClientSelect={setSelectedClient} />
          <div className="mt-6">
            <ShoppingCartComponent
              cart={cart}
              onUpdateQuantity={updateQuantity}
              onRemoveFromCart={removeFromCart}
              onGenerateInvoice={generateInvoice}
              isGenerating={isGenerating}
              error={error}
            />
          </div>
        </div>
      </div>

      {invoicePdf && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <FileText className="mr-2" />
            Factura Generada
          </h2>
          <iframe src={invoicePdf} className="w-full h-[600px] border rounded" />
        </div>
      )}
    </div>
  );
}