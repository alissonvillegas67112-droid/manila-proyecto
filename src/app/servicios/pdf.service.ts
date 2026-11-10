import { Injectable, inject } from '@angular/core';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Cliente } from '../entidades/cliente';
import { ItemCarrito } from '../entidades/producto';
import { PrecioService } from './precio.service';

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  private precioService = inject(PrecioService);

  generarPedido(cliente: Cliente, items: ItemCarrito[], total: number): void {
    const doc = new jsPDF();
    const fecha = new Date().toLocaleDateString('es-CO');

    doc.setFillColor(29, 59, 47);
    doc.rect(0, 0, 210, 32, 'F');

    doc.setTextColor(248, 242, 230);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(24);
    doc.text('MANILA', 14, 18);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text('Restaurante', 14, 25);

    doc.setTextColor(44, 42, 38);
    doc.setFontSize(11);
    doc.text('Fecha: ' + fecha, 14, 44);

    doc.setFont('helvetica', 'bold');
    doc.text('Datos del cliente', 14, 56);

    doc.setFont('helvetica', 'normal');
    doc.text('Nombre: ' + cliente.nombre, 14, 64);
    doc.text('Celular: ' + cliente.celular, 14, 71);
    doc.text('Dirección: ' + cliente.direccion, 14, 78);

    autoTable(doc, {
      startY: 88,
      head: [['Producto', 'Tipo', 'Cantidad', 'Precio unitario', 'Subtotal']],
      body: items.map(item => [
        item.producto.nombre,
        item.producto.tipo === 'comida' ? 'Comida' : 'Bebida',
        item.cantidad.toString(),
        this.precioService.formatearPrecio(item.producto.precio),
        this.precioService.formatearPrecio(item.producto.precio * item.cantidad)
      ]),
      theme: 'grid',
      headStyles: {
        fillColor: [29, 59, 47],
        textColor: [248, 242, 230]
      },
      alternateRowStyles: {
        fillColor: [248, 242, 230]
      },
      styles: {
        fontSize: 9
      }
    });

    const finalY = (doc as any).lastAutoTable.finalY;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(90, 58, 41);
    doc.text('Total general: ' + this.precioService.formatearPrecio(total), 14, finalY + 12);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(107, 98, 88);
    doc.text('Proyecto de ejemplo · Restaurante Manila', 14, 290);

    doc.save('pedido-manila.pdf');
  }

}
