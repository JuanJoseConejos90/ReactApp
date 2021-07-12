/**
 *  Author: JuanJosé Conejo Sanabria
 *  Description: Page Products
 */

import React, { useState, useRef, useEffect } from "react";
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import ProductService from './../../../services/ProductService';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Product, ListProduct } from "./../../../models/Product";
import { ClassicSpinner } from "react-spinners-kit";
import './Products.css';

const Products = () => {

    let emptyProduct = new Product();
    let ListProducts = new ListProduct();
    const [products, setProducts] = useState([]);
    const [productDialog, setProductDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [product, setProduct] = useState(emptyProduct);
    const [selectedProducts, setSelectedProducts] = useState(ListProducts);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState("");
    const [load, setload] = useState(false);
    const toast: any = useRef(null);
    const dt: any = useRef(null);
    const productService = new ProductService();


    const cols = [
        { field: 'cod', header: 'Codigo' },
        { field: 'name', header: 'Nombre' },
        { field: 'price', header: 'Precio' },
        { field: 'iva', header: 'IVA' },
        { field: 'total', header: 'Total' },
        { field: 'created', header: 'Creado' },
        { field: 'createdBy', header: 'Creador' },
    ];

    const exportColumns = cols.map(col => ({ title: col.header, dataKey: col.field }));


    const formatCurrency = (value: any) => {
        return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    }

    const openNew = () => {
        setProduct(emptyProduct);
        setSubmitted(false);
        setProductDialog(true);
    }

    const hideDialog = () => {
        setSubmitted(false);
        setProductDialog(false);
    }

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    }

    const hideDeleteProductsDialog = () => {
        setDeleteProductsDialog(false);
    }

    const saveProduct = () => {

        setSubmitted(true);
        setload(true);

        try {

            if (product.name.trim()) {
                if (product.id === 0) {
                    saveProductAction();
                } else {
                    updateProductAction();
                }
            } else {
                toast.current.show({ severity: 'success', summary: 'Success Message', detail: 'Informacion Incompleta', life: 3000 });
            }

        } catch (error) {

        }
    }

    const saveProductAction = () => {
        try {

            productService.createProduct(product)
                .then(response => response)
                .then(data => {
                    if (data.code === "00") {
                        setTimeout(() => {
                            clearSettings();
                            getProducts();
                            toast.current.show({ severity: 'success', summary: 'Success Message', detail: 'Producto Creado', life: 3000 });
                        }, 2000);
                    }
                }).catch(error => {
                    console.log(error);
                    clearSettings();
                    toast.current.show({ severity: 'info', summary: 'Info Message', detail: 'Producto no creado', life: 3000 });
                });
        } catch (error) {
            console.log(console.error);
        }
    }

    const updateProductAction = () => {
        try {

            productService.updateProduct(product)
                .then(response => response)
                .then(data => {
                    if (data.code === "00") {
                        setTimeout(() => {
                            clearSettings();
                            getProducts();
                            toast.current.show({ severity: 'success', summary: 'Success Message', detail: 'Producto Editado', life: 3000 });
                        }, 2000);
                    }
                }).catch(error => {
                    console.log(error);
                    clearSettings();
                    toast.current.show({ severity: 'info', summary: 'Info Message', detail: 'Producto no Editado', life: 3000 });
                });
        } catch (error) {
            console.log(console.error);
        }
    }

    const deleteProductAction = (id: number) => {
        try {

            setload(true);
            productService.deleteProduct(id)
                .then(response => response)
                .then(data => {
                    if (data.code === "00") {
                        setTimeout(() => {
                            clearSettings();
                            getProducts();
                            toast.current.show({ severity: 'success', summary: 'Success Message', detail: 'Producto Eliminado', life: 3000 });
                        }, 2000);
                    }
                }).catch(error => {
                    console.log(error);
                    clearSettings();
                    toast.current.show({ severity: 'info', summary: 'Info Message', detail: 'Producto no Eliminado', life: 3000 });
                });
        } catch (error) {
            console.log(console.error);
        }
    }

    const clearSettings = () => {
        let emptyProduct = new Product();
        let emptyProductList = new ListProduct();
        setDeleteProductDialog(false);
        setProduct(emptyProduct);
        setSelectedProducts(emptyProductList);
        setProductDialog(false);
        setDeleteProductsDialog(false);
        setload(false);
    }

    const editProduct = (product: Product) => {
        setProduct({ ...product });
        setProductDialog(true);
    }

    const confirmDeleteProduct = (product: Product) => {
        setProduct(product);
        setDeleteProductDialog(true);
    }

    const deleteProduct = () => {

        try {
            let _products = products.filter(x => x === product);

            if (_products.length > 0) {
                deleteProductAction(product.id);

            } else {
                toast.current.show({ severity: 'success', summary: 'Success Message', detail: 'Seleccione al menos 1 producto', life: 3000 });
            }

        } catch (error) {
            console.log(error);
        }
    }

    const exportPdf = () => {
        import('jspdf').then(jsPDF => {
            import('jspdf-autotable').then(() => {
                const doc: any = new jsPDF.default("l", "pt");
                doc.autoTable(exportColumns, products)
                doc.save('products.pdf');
            })
        })
    }

    const confirmDeleteSelected = () => {
        setDeleteProductsDialog(true);
    }

    const deleteSelectedProducts = () => {
    }

    const onInputChange = (event: any) => {
        const target = event.target;
        const name = target.name;
        const value = event.currentTarget.value;
        setProduct({ ...product, [name]: value });
    }

    const onInputNumberChange = (event: any) => {
        const target = event.originalEvent.currentTarget;
        const name = target.name;
        const value = event.value;
        if (value) {
            setProduct({ ...product, [name]: value });
        }

    }

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="New" icon="pi pi-plus" className="p-button-success p-mr-2" onClick={openNew} />
            </React.Fragment>
        )
    }

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="Print" icon="pi pi-file-pdf" className="p-button-help" onClick={exportPdf} />
            </React.Fragment>
        )
    }

    const PriceBodyTemplate = (rowData: any) => {
        return formatCurrency(rowData.price);
    }

    const IVABodyTemplate = (rowData: any) => {
        return formatCurrency(rowData.iva);
    }

    const TotalBodyTemplate = (rowData: any) => {
        return formatCurrency(rowData.total);
    }

    const actionBodyTemplate = (rowData: any) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2" onClick={() => editProduct(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteProduct(rowData)} />
            </React.Fragment>
        );
    }

    const header = (
        <div className="table-header">
            <h5 className="p-m-0">Manage Products</h5>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onChange={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );
    
    const productDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveProduct} />
        </React.Fragment>
    );
    const deleteProductDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteProduct} />
        </React.Fragment>
    );
    const deleteProductsDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductsDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedProducts} />
        </React.Fragment>
    );

    const getProducts = () => {
        productService.getAllProducts().then(data => setProducts(data.data));
    }

    useEffect(() => {
        getProducts();
    }, []);


    return (
        <div className="container">

            <div className="row loading">
                {load && <ClassicSpinner size={100} color="#268EFC" loading={load} />}
            </div>
            <div className="datatable-crud-demo">
                <Toast ref={toast} />

                <div className="card">
                    <Toolbar className="p-mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable id="TableProducts" ref={dt} value={products} selection={selectedProducts} onSelectionChange={(e) => setSelectedProducts(e.value)}
                        dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                        globalFilter={globalFilter}
                        header={header}>

                        <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                        <Column field="cod" header="Codigo" sortable></Column>
                        <Column field="name" header="Nombre" sortable></Column>
                        <Column field="price" header="Precio" body={PriceBodyTemplate} sortable></Column>
                        <Column field="iva" header="IVA" body={IVABodyTemplate} sortable></Column>
                        <Column field="total" header="Total" body={TotalBodyTemplate} sortable></Column>
                        <Column body={actionBodyTemplate}></Column>
                    </DataTable>
                </div>

                <Dialog visible={productDialog} style={{ width: '450px' }} header="Product Details" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>

                    <div className="p-field">
                        <label htmlFor="cod">Codigo</label>
                        <InputText id="cod" name="cod" value={product.cod} onChange={(event) => onInputChange(event)} required autoFocus className={classNames({ 'p-invalid': submitted && !product.name })} />
                        {submitted && !product.name && <small className="p-error">Name is required.</small>}
                    </div>

                    <div className="p-field">
                        <label htmlFor="name">Name</label>
                        <InputText id="name" name="name" value={product.name} onChange={(event) => onInputChange(event)} required autoFocus className={classNames({ 'p-invalid': submitted && !product.name })} />
                        {submitted && !product.name && <small className="p-error">Name is required.</small>}
                    </div>

                    <div className="p-formgrid p-grid">
                        <div className="p-field p-col">
                            <label htmlFor="price">Price</label>
                            <InputNumber id="price" name="price" value={product.price} onChange={(event) => onInputNumberChange(event)} mode="currency" currency="USD" locale="en-US" />
                        </div>
                        <div className="p-field p-col">
                            <label htmlFor="iva">IVA</label>
                            <InputNumber id="iva" name="iva" value={product.iva} onChange={(event) => onInputNumberChange(event)} mode="currency" currency="USD" locale="en-US" />
                        </div>
                        <div className="p-field p-col">
                            <label htmlFor="total">Total</label>
                            <InputNumber id="total" name="total" value={product.total} onChange={(event) => onInputNumberChange(event)} mode="currency" currency="USD" locale="en-US" />
                        </div>
                    </div>
                </Dialog>

                <Dialog visible={deleteProductDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                    <div className="confirmation-content">
                        <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
                        {product && <span>Desea eliminar el producto: <b>{product.name}</b>?</span>}
                    </div>
                </Dialog>

                <Dialog visible={deleteProductsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
                    <div className="confirmation-content">
                        <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
                        {product && <span>Are you sure you want to delete the selected products?</span>}
                    </div>
                </Dialog>
            </div>
        </div>
    );
}

export default Products;
