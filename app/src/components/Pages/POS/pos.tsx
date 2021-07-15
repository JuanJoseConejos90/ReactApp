/**
 *  Author: JuanJosé Conejo Sanabria
 *  Description: Page POS
 */

import React, { useState, useRef, useEffect } from "react";
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import { AutoComplete } from 'primereact/autocomplete';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import ProductService from './../../../services/ProductService';
import PosService from "./../../../services/PosService";
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { Product } from "./../../../models/Product";
import { PostDto, POSReq } from "./../../../models/Pos";
import { ClassicSpinner } from "react-spinners-kit";

import './pos.css';

const PosComponent = () => {

    let product = new Product();
    const [pos, setpost] = useState<PostDto[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [desc, setdesc] = useState("");
    const [cant, setCant] = useState(0);
    const [selectedFilter, setSelectedFilter] = useState(product);
    const [sugProducts, setSugProducts] = useState<Product[]>([]);
    const [load, setload] = useState(false);
    const [Total, setTotal] = useState(0);
    const toast: any = useRef(null);
    const productService = new ProductService();
    const posService = new PosService();


    const cols = [
        { field: 'cod', header: 'Codigo' },
        { field: 'name', header: 'Nombre' },
        { field: 'price', header: 'Precio' },
        { field: 'iva', header: 'IVA' },
        { field: 'cant', header: 'Cantidad' },
        { field: 'total', header: 'Total' },
        { field: 'created', header: 'Creado' },
        { field: 'createdBy', header: 'Creador' },
    ];

    const exportColumns = cols.map(col => ({ title: col.header, dataKey: col.field }));

    const changeFilter = (event: Product) => {
        setSelectedFilter(event);
        setdesc(event.name);
    }

    const addProduct = () => {

        try {

            setload(true);
            setTimeout(() => {
                if (selectedFilter.cod) {
                    const exist = pos.filter(x => x.cod === selectedFilter.cod);
                    if (exist.length === 0) {
                        let POS = new PostDto();
                        let totalAmount = ((selectedFilter.price + selectedFilter.iva) * +cant);
                        POS.id = selectedFilter.id;
                        POS.cod = selectedFilter.cod;
                        POS.name = desc;
                        POS.iva = selectedFilter.iva;
                        POS.cant = cant;
                        POS.price = selectedFilter.price;
                        POS.total = totalAmount;
                        setTotales(totalAmount);
                        setpost([...pos, POS]);
                        clearData();
                        toast.current.show({ severity: 'success', summary: 'Success', detail: 'Product Agregado' });
                    } else {
                        clearData();
                        toast.current.show({ severity: 'info', summary: 'Info Message', detail: 'Debe se seleccionar otro codigo de Producto', life: 3000 });
                    }

                } else {
                    toast.current.show({ severity: 'info', summary: 'Info Message', detail: 'Se debe completar la informacion', life: 3000 });
                }

            }, 2000);

        } catch (error) {
            console.log(error);
        }

        setload(false);
    }

    const setTotales = (amount: number) => {

        try {
            let total = Total;
            total += amount;
            setTotal(total)
        } catch (error) {
            console.log(error);
        }
    }

    const clearData = () => {
        let product = new Product();
        setCant(0);
        setSelectedFilter(product);
        setdesc("");
    }

    const searchProduct = (event: any) => {
        setTimeout(() => {
            let _filteredProducts;
            if (!event.query.trim().length) {
                _filteredProducts = [...products];
            }
            else {
                _filteredProducts = products.filter((data) => {
                    return data.cod.toLowerCase().startsWith(event.query.toLowerCase());
                });
            }
            setSugProducts(_filteredProducts);
        }, 250);
    }

    const save = () => {

        try {

            setload(true);
            setTimeout(() => {
                let req = new POSReq();
                req.id = 0;
                req.cod = createId();
                req.details = JSON.stringify(pos);

                posService.createPOS(req)
                    .then(response => response)
                    .then(data => {
                        if (data.code === "00") {
                            setTimeout(() => {
                                setpost([]);
                                clearData();
                                toast.current.show({ severity: 'success', summary: 'Success', detail: 'POS Creado' });
                            }, 2000);
                        } else {
                            toast.current.show({ severity: 'info', summary: 'Info Message', detail: 'POS no creado', life: 3000 });
                        }
                    }).catch(error => {
                        console.log(error);
                        toast.current.show({ severity: 'info', summary: 'Info Message', detail: 'Producto no creado', life: 3000 });
                    });

            }, 3000);

        } catch (error) {
            console.log(error);
        }

        setload(false);
    }

    const print = () => {
        import('jspdf').then(jsPDF => {
            import('jspdf-autotable').then(() => {
                const doc: any = new jsPDF.default("l", "pt");
                doc.autoTable(exportColumns, pos)
                doc.save('POS.pdf');
            })
        })
    }

    const createId = () => {
        let id = '';
        let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <span className="p-input-icon-left p-mr-2">
                    <i className="pi pi-search" />
                    <AutoComplete value={selectedFilter}
                        suggestions={sugProducts}
                        completeMethod={searchProduct}
                        field="cod"
                        onChange={(e) => changeFilter(e.value)} />
                </span>
                <div className="p-col-12 p-md-8">
                    <div className="p-inputgroup">
                        <InputText type="text" value={desc} readOnly placeholder="Nombre" />
                    </div>
                </div>

                <div className="p-mr-2">
                    <InputNumber inputId="integeronly" value={cant} onValueChange={(e) => setCant(e.value)} placeholder="Cantidad" />
                </div>
                <div className="p-mr-2">
                    <Button label="Agregar" icon="pi pi-plus" className="p-button-success p-mr-2" onClick={addProduct} />
                </div>
            </React.Fragment>
        )
    }

    const footer = (
        <div className="p-d-flex p-ai-center p-py-2">
            <Button label="Save" icon="pi pi-plus" disabled={!pos || !pos.length} className="p-button-success p-mr-2" onClick={save} />
            <Button label="Print" icon="pi pi-file-pdf ml-auto" disabled={!pos || !pos.length} className="p-button-help" onClick={print} />
            <Button type="button" className="p-button-text p-button-plain p-ml-auto" ><b>Total:{Total}</b></Button>
        </div>
    );

    const getProducts = () => {
        productService.getAllProducts().then(data => setProducts(data.data));
    }

    useEffect(() => {
        getProducts();
    }, []);


    return (
        <div className="container">
            <Toast ref={toast} />
            <div className="row loading">
                {load && <ClassicSpinner size={100} color="#268EFC" loading={load} />}
            </div>
            <div className="card">
                <Toolbar className="p-mb-4" left={leftToolbarTemplate}></Toolbar>
                <DataTable value={pos} footer={footer}>
                    <Column field="cod" header="Codigo"></Column>
                    <Column field="name" header="Nombre"></Column>
                    <Column field="price" header="Precio"></Column>
                    <Column field="iva" header="IVA"></Column>
                    <Column field="cant" header="Cantidad"></Column>
                    <Column field="total" header="Total"></Column>
                </DataTable>
            </div>

        </div>
    );
}

export default PosComponent;